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
        const { marketId, guestUserId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(guestUserId) || !mongoose.Types.ObjectId.isValid(marketId)) return res.status(400).json({ success: false, message: "guestUserId ID is required" });
        const isMarket = await CreateMarketModel.findById(marketId)
        const isGuestUser = await UserModel.findById(guestUserId);
        if (!isMarket || !isGuestUser) return res.status(400).json({ success: false, message: "Market Or Guest User Not Exist" });
        const today = new Date().toISOString().split("T")[0];
        const alreadyVoted = isMarket.userVote.find(
            (item) =>
                item.user.toString() === guestUserId.toString() &&
                item.votedAt.toISOString().split("T")[0] === today
        );
        if (!alreadyVoted) return res.status(404).json({ success: false });
        const data = await CreateMarketModel.findById(marketId).populate("userVote.user", "votes")
        return res.status(200).json({ success: true, data: data });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

const userVoteCountOnNumber = async (req, res) => {
    try {
        const marketId = req.params.marketId;
        if (!mongoose.Types.ObjectId.isValid(marketId))
            return res.status(400).json({ success: false, message: "Market ID is required" });
        const isMarket = await CreateMarketModel.findById(marketId);
        if (!isMarket)
            return res.status(400).json({ success: false, message: "Market Not Exist" });
        const todayDate = new Date().toISOString().split("T")[0];
        const todayVotedUser = isMarket.userVote.filter((item) => {
            return item.votedAt.toISOString().split("T")[0] === todayDate;
        });
        
    } catch (error) {
        console.log(error.message);
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