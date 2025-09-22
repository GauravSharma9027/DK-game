const { default: mongoose } = require("mongoose");
const GuesserModel = require("../model/Guesser.model");
const GuesserRequestModel = require("../model/GuesserRequest.model");
const PostModel = require("../model/Post.model");
const jwtGenerate = require('../utils/jwt.generate.utils');
const bcrypt = require("bcryptjs");
const UserModel = require("../model/User.model");
const saltRounds = Number(process.env.SALT_ROUNDS) || 10;

const createGuesser = async (req, res) => {
    try {
        if (!req.body) return res.status(400).json({ success: false, message: 'req.body not Found' });
        const { guesserRequestId, password } = req.body;
        if (!guesserRequestId || !password) return res.status(400).json({ success: false, message: 'All fields are required' });
        const isGuesserRequest = await GuesserRequestModel.findById(guesserRequestId);
        if (!isGuesserRequest) return res.status(400).json({ success: false, message: 'Not Found Any Requested Become A Guesser' });
        if (isGuesserRequest.status !== "approved") return res.status(400).json({ success: false, message: 'This Request Is Not Approve For Become A Guesser ' });
        const alreadyGuesser = await GuesserModel.findOne({ whatsAppNumber: isGuesserRequest.whatsAppNumber });
        if (alreadyGuesser) return res.status(400).json({ success: false, message: 'This user is already a Guesser' });
        const hashedPassword = bcrypt.hashSync(password, saltRounds);
        const newGuesser = new GuesserModel({
            realName: isGuesserRequest.realName,
            userGuestId: isGuesserRequest.userGuestId,
            guesserName: isGuesserRequest.guesserName,
            experience: isGuesserRequest.experience,
            whatsAppNumber: isGuesserRequest.whatsAppNumber,
            reason: isGuesserRequest.reason,
            password: hashedPassword
        });
        await GuesserRequestModel.findByIdAndUpdate(
            guesserRequestId,
            { $set: { credentialCreated: "created" } },
            { new: true }
        );
        await GuesserModel.create(newGuesser);
        return res.status(201).json({ success: true, message: "Guesser created successfully" });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

const getAllGuesser = async (req, res) => {
    try {
        const Guessers = await GuesserModel.find().select("-password -__v -voteByUser").sort({ vote: -1 });;
        return res.status(200).json({ success: true, data: Guessers });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

const getAllGuesserCount = async (req, res) => {
    try {
        const Guessers = await GuesserModel.find().select("-password -__v -voteByUser").sort({ vote: -1 });;
        return res.status(200).json({ success: true, data: Guessers.length });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

const getGuesserPost = async (req, res) => {
    try {
        const GuesserId = req.params.guesserId;
        if (!GuesserId) return res.status(400).json({ success: false, message: 'GuesserId not Received' });
        const isGuesser = await GuesserModel.findById(GuesserId);
        if (!isGuesser) return res.status(400).json({ success: false, message: 'Guesser is Not Exist' });
        const guesserAllPost = await PostModel.find({ GuesserMongooseID: GuesserId });
        if (!guesserAllPost || guesserAllPost.length === 0) return res.status(400).json({ success: false, message: 'No Any Post' });
        return res.status(200).json({ success: true, data: guesserAllPost });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }

}

const userVoteOnGuesser = async (req, res) => {
    try {
        if (!req.body) return res.status(400).json({ success: false, message: 'req.body not Received' });
        const { guesserId, guestUserId } = req.body;
        if (!mongoose.Types.ObjectId.isValid(guesserId) || !mongoose.Types.ObjectId.isValid(guestUserId)) return res.status(400).json({ success: false, message: 'guesserId or guestUserId is missing' });
        const isGuestUser = await UserModel.findById(guestUserId);
        if (!isGuestUser) return res.status(400).json({ success: false, message: 'Guest User Not Found' });
        const isGuesser = await GuesserModel.findById(guesserId);
        if (!isGuesser) return res.status(400).json({ success: false, message: 'Guesser Not Found' });
        const today = new Date().toISOString().split("T")[0];
        const guestUserVotedToday = isGuesser.voteByUser.find((item) =>
            item.guestUser.toString() === guestUserId.toString() &&
            item.votedAt.toISOString().split("T")[0] === today
        );
        if (guestUserVotedToday) return res.status(400).json({ success: true, message: "You can vote again after 12 AM" });
        const newVote = {
            guestUser: guestUserId,
            votedAt: new Date()
        }
        isGuesser.voteByUser.push(newVote);
        isGuesser.vote = isGuesser.voteByUser.length;
        await isGuesser.save();
        return res.status(200).json({ success: true, message: "Vote successfully" });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

const userIsVotedOnGuesser = async (req, res) => {
    try {
        if (!req.body) return res.status(400).json({ success: false, message: 'req.body not Received' });
        const { guesserId, guestUserId } = req.body;
        if (!mongoose.Types.ObjectId.isValid(guesserId) || !mongoose.Types.ObjectId.isValid(guestUserId)) return res.status(400).json({ success: false, message: 'guesserId or guestUserId is missing' });
        const isGuestUser = await UserModel.findById(guestUserId);
        if (!isGuestUser) return res.status(400).json({ success: false, message: 'Guest User Not Found' });
        const isGuesser = await GuesserModel.findById(guesserId);
        if (!isGuesser) return res.status(400).json({ success: false, message: 'Guesser Not Found' });
        const today = new Date().toISOString().split("T")[0];
        const guestUserVotedToday = isGuesser.voteByUser.find((item) =>
            item.guestUser.toString() === guestUserId.toString() &&
            item.votedAt.toISOString().split("T")[0] === today
        );
        if (!guestUserVotedToday) return res.status(200).json({ success: false, message: "Not Voted" });
        return res.status(200).json({ success: true, message: "Is Voted" });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

const topTenGuesser = async (req, res) => {
    try {
        const Guessers = await GuesserModel.find().select("-password -__v -voteByUser").sort({ vote: -1 }).limit(10)
        return res.status(200).json({ success: true, data: Guessers });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

const changePassword = async (req, res) => {
    try {
        if (!req.body) return res.status(400).json({ success: false, message: 'req.body not Found' });
        const { number, password } = req.body;
        if (!number || !password) return res.status(400).json({ success: false, message: 'All fields are required' });
        const isGuesser = await GuesserModel.findOne({ whatsAppNumber: number });
        if (!isGuesser || isGuesser.length === 0) return res.status(400).json({ success: false, message: 'Guesser Not Found Or Miss Match Number' });
        const hashedPassword = bcrypt.hashSync(password, saltRounds);
        isGuesser.password = hashedPassword;
        await isGuesser.save();
        return res.status(201).json({ success: true, message: "Password Change successfully" });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

const loginGuesser = async (req, res) => {
    try {
        const { whatsAppNumber, password } = req.body;
        if (!whatsAppNumber || !password) return res.status(400).json({ success: false, message: "All field is Required." });
        const isGuesser = await GuesserModel.findOne({ whatsAppNumber: whatsAppNumber }).select("-__v -voteByUser");
        if (!isGuesser) return res.status(400).json({ success: false, message: "Number is Not Registered." });
        const IsMatched = bcrypt.compareSync(password, isGuesser.password);
        if (!IsMatched) return res.status(400).json({ success: false, message: "Password Is Wrong" });
        if (isGuesser.isBlocked) return res.status(403).json({ success: false, message: "This Account is Blocked" });
        const payload = {
            guesserId: isGuesser._id,
            whatsAppNumber: isGuesser.whatsAppNumber,
        }
        const token = jwtGenerate(payload);
        const { password: pwd, ...guesserData } = isGuesser.toObject();
        const data = {
            guesserData,
            token
        }
        return res.status(200).json({ success: true, message: "Login Successfully", data: data, })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

const logoutGuesser = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: false,
            sameSite: "Lax"
        });
        return res.status(200).json({ success: true, message: "Logout Successfully" });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// // Block guesser
// const blockGuesser = async (req, res) => {
//     try {
//         const guesserId= req.params.guesserId;
//         const isGuesser = await GuesserModel.findById(guesserId);
//         if (!isGuesser) return res.status(404).json({ success: false, message: "Guesser not found" });
//         if (isGuesser.isBlocked) return res.status(404).json({ success: false, message: "Guesser Already Unblock" });
//         isGuesser.isBlocked = false;
//         await isGuesser.save();
//         return res.status(200).json({ success: true, message: "Guesser unblocked successfully" });
//     } catch (error) {
//         console.error("Unblock error:", error);
//         return res.status(500).json({ success: false, message: "Internal Server Error" });
//     }
// };

// // Unblock guesser
// const unblockGuesser = async (req, res) => {
//     try {
//         const guesserId= req.params.guesserId;
//         const isGuesser = await GuesserModel.findById(guesserId);
//         if (!isGuesser) return res.status(404).json({ success: false, message: "Guesser not found" });
//         if (isGuesser.isBlocked) return res.status(404).json({ success: false, message: "Guesser Already Unblock" });
//         isGuesser.isBlocked = false;
//         await isGuesser.save();
//         return res.status(200).json({ success: true, message: "Guesser unblocked successfully" });
//     } catch (error) {
//         console.error("Unblock error:", error);
//         return res.status(500).json({ success: false, message: "Internal Server Error" });
//     }
// };

module.exports = {
    createGuesser,
    getAllGuesser,
    getAllGuesserCount,
    getGuesserPost,
    userVoteOnGuesser,
    userIsVotedOnGuesser,
    topTenGuesser,
    loginGuesser,
    logoutGuesser,
    changePassword,
}