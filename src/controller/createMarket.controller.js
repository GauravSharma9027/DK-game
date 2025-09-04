const { default: mongoose } = require("mongoose");
const CreateMarket = require("../model/CreateMarket.model");
const CreateMarketModel = require("../model/CreateMarket.model");
const UserModel = require("../model/User.model");

const createMarket = async (req, res) => {
    try {
        if (!req.body) return res.status(400).json({ success: false, message: 'req.body not Found' });
        console.log(req.body);
        const { marketName, openSession, closeSession, accountType, status } = req.body;
        if (!marketName || !openSession || !closeSession || !accountType || !status) return res.status(400).json({ success: false, message: 'All fields are required' });
        await CreateMarket.create({ marketName, openSession, closeSession, accountType, status });
        return res.status(200).json({ success: true, message: 'Market Create Successfully' });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

const getAllMarket = async (req, res) => {
    try {
        const markets = await CreateMarket.find({}).sort({ createdAt: -1 });
        return res.status(200).json({ success: true, data: markets })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

const editMarket = async (req, res) => {
    try {
        const createdMarketId = req.params.createdMarketId;
        if (!createdMarketId) return res.status(400).json({ success: false, message: "Market ID is required" });
        if (!req.body) return res.status(400).json({ success: false, message: 'req.body not Found' });
        const isCreatedMarket = await CreateMarket.findById(createdMarketId);
        if (!isCreatedMarket) return res.status(400).json({ success: false, message: 'Market not Found' });
        const { marketName, openSession, closeSession, accountType, status } = req.body;
        if (!marketName && !openSession && !closeSession && !accountType && !status) return res.status(400).json({ success: false, message: 'One fields are required' });
        if (marketName) isCreatedMarket.marketName = marketName;
        if (openSession) isCreatedMarket.openSession = openSession;
        if (closeSession) isCreatedMarket.closeSession = closeSession;
        if (accountType) isCreatedMarket.accountType = accountType;
        if (status) isCreatedMarket.status = status;
        await isCreatedMarket.save();
        return res.status(200).json({ success: true, message: 'Market Updated Successfully' });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

const deleteMarket = async (req, res) => {
    try {
        const createdMarketId = req.params.createdMarketId;
        if (!createdMarketId) return res.status(400).json({ success: false, message: "Market ID is required" });
        const deletedMarket = await CreateMarket.findByIdAndDelete(createdMarketId);
        if (!deletedMarket) return res.status(404).json({ success: false, message: "Market not found" });
        return res.status(200).json({ success: true, message: 'Market Delete Successfully' })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

const guestUserIsVotedOnMarket = async (req, res) => {
    try {
        const { marketId, guestUserId } = req.body;
        if (!mongoose.Types.ObjectId.isValid(guestUserId) || !mongoose.Types.ObjectId.isValid(marketId)) {
            return res.status(400).json({ success: false, message: "guestUserId or marketId is invalid" });
        }
        const isMarket = await CreateMarketModel.findById(marketId);
        const isGuestUser = await UserModel.findById(guestUserId);
        if (!isMarket || !isGuestUser) {
            return res.status(400).json({ success: false, message: "Market Or Guest User Not Exist" });
        }
        const today = new Date().toISOString().split("T")[0];
        // check if user voted today
        const alreadyVoted = isMarket.userVote.find(
            (item) =>
                item.user.toString() === guestUserId.toString() &&
                item.votedAt.toISOString().split("T")[0] === today
        );
        if (!alreadyVoted) {
            return res.status(404).json({ success: false, message: "No Any vote" });
        }

        // populate user with votes
        const populatedMarket = await CreateMarketModel.findById(marketId)
            .populate("userVote.user", "votes");

        // filter only that user's info
        const userVoteInfo = populatedMarket.userVote.find(
            (uv) => uv.user._id.toString() === guestUserId.toString()
        );

        // अब उस user.votes को filter करेंगे
        let filteredVotes = [];
        if (userVoteInfo?.user?.votes?.length) {
            filteredVotes = userVoteInfo.user.votes.filter(vote =>
                vote.marketId.toString() === marketId.toString() &&
                new Date(vote.voteDate).toISOString() === alreadyVoted.votedAt.toISOString()
            );
        }

        return res.status(200).json({
            success: true,
            market: {
                _id: populatedMarket._id,
                marketName: populatedMarket.marketName,
                openSession: populatedMarket.openSession,
                closeSession: populatedMarket.closeSession
            },
            user: {
                _id: userVoteInfo.user._id,
                votes: filteredVotes
            }
        });

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

const userVoteCountOnNumber = async (req, res) => {
    try {
        const marketId = req.params.marketId;
        // Validate Market ID
        if (!mongoose.Types.ObjectId.isValid(marketId)) {
            return res.status(400).json({ success: false, message: "Market ID is invalid or missing" });
        }
        // Fetch Market
        const isMarket = await CreateMarketModel.findById(marketId).lean();
        if (!isMarket) {
            return res.status(404).json({ success: false, message: "Market not found" });
        }
        const todayDate = new Date().toISOString().split("T")[0];
        // Filter today's voted users
        const todayVotedUser = (isMarket.userVote || [])
            .filter((item) => item.votedAt && item.votedAt.toISOString().split("T")[0] === todayDate)
            .map((item) => ({
                user: item.user,
                votedAt: item.votedAt.toISOString().split("T")[0],
            }));
        if (todayVotedUser.length === 0) {
            return res.status(200).json({
                success: true,
                data: { openSessionCount: {}, closeSessionCount: {} },
                message: "No votes found for today"
            });
        }
        // Populate userVote.user with today's votes
        const sameMarketOnTodayUsersVote = await CreateMarketModel.findById(marketId)
            .populate({
                path: "userVote.user",
                select: "userGuestId votes",
                match: {
                    _id: { $in: todayVotedUser.map(item => item.user) },
                    "votes.marketId": marketId,
                    "votes.voteDate": {
                        $gte: new Date(todayDate + "T00:00:00.000Z"),
                        $lte: new Date(todayDate + "T23:59:59.999Z")
                    }
                }
            })
            .select("userVote")
            .lean();

        // Filter null users after populate
        sameMarketOnTodayUsersVote.userVote = (sameMarketOnTodayUsersVote.userVote || [])
            .filter(item => item.user !== null);
        // Initialize counts for 0-9
        const openSessionCount = {};
        const closeSessionCount = {};
        for (let i = 0; i <= 9; i++) {
            openSessionCount[i] = 0;
            closeSessionCount[i] = 0;
        }
        // Loop through userVote array safely
        (sameMarketOnTodayUsersVote.userVote || []).forEach((uv) => {
            if (!uv.user || !Array.isArray(uv.user.votes)) return;
            uv.user.votes.forEach((vote) => {
                if (Array.isArray(vote.openSessionVoteNumber)) {
                    vote.openSessionVoteNumber.forEach(num => {
                        if (num >= 0 && num <= 9) {
                            openSessionCount[num] = (openSessionCount[num] || 0) + 1;
                        }
                    });
                }
                if (Array.isArray(vote.closeSessionVoteNumber)) {
                    vote.closeSessionVoteNumber.forEach(num => {
                        if (num >= 0 && num <= 9) {
                            closeSessionCount[num] = (closeSessionCount[num] || 0) + 1;
                        }
                    });
                }
            });
        });
        const data = { openSessionCount, closeSessionCount };
        return res.status(200).json({ success: true, data });
    } catch (error) {
        console.error("Error in userVoteCountOnNumber:", error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

module.exports = {
    createMarket,
    getAllMarket,
    editMarket,
    deleteMarket,
    guestUserIsVotedOnMarket,
    userVoteCountOnNumber,
}