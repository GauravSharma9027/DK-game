const mongoose = require("mongoose");
const UserModel = require("../model/User.model");
const CreateMarketModel = require("../model/CreateMarket.model");
const THRESHOLD_HOURS = 24;


// unique gest id generate function
function generateGuestUserId() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const date = String(now.getDate()).padStart(2, "0");
    const hour = String(now.getHours()).padStart(2, "0");
    const minute = String(now.getMinutes()).padStart(2, "0");
    const second = String(now.getSeconds()).padStart(2, "0");
    const ms = String(now.getMilliseconds()).padStart(3, "0");
    return `GUEST-${year}${month}${date}${hour}${minute}${second}${ms}`;
}

// user guest auto login
const guestUser = async (req, res) => {
    try {
        if (!req.body) return res.status(400).json({ success: false, message: 'req.body not Found' });
        const { deviceID } = req.body;
        if (!deviceID) return res.status(400).json({ success: false, message: 'All fields are required' });
        const isGuestUser = await UserModel.findOne({ deviceID });
        if (isGuestUser) {
            isGuestUser.lastLogin = new Date();
            await isGuestUser.save();
            const isGuestUserIST = isGuestUser.toObject();
            isGuestUserIST.lastLoginIST = isGuestUser.lastLogin.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
            delete isGuestUserIST.lastLogin
            return res.status(200).json({ success: true, data: isGuestUserIST, message: 'User Login' });
        }
        let userGuestId = generateGuestUserId();
        while (await UserModel.findOne({ userGuestId })) {
            userGuestId = generateGuestUserId();
        }
        const newGuestUser = await UserModel.create({ userGuestId, deviceID });
        const newGuestUserIST = newGuestUser.toObject();
        newGuestUserIST.lastLoginIST = newGuestUser.lastLogin.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
        delete newGuestUserIST.lastLogin;
        return res.status(201).json({ success: true, data: newGuestUserIST, message: 'User register' });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

// get all guest user
const getAllGuestUser = async (req, res) => {
    try {
        const guestUsers = await UserModel.find({});
        return res.status(200).json({ success: true, data: guestUsers })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

// user vote
const guestUserVote = async (req, res) => {
    try {
        if (!req.body) return res.status(400).json({ success: false, message: 'req.body not Found' });
        const { deviceID, marketId, openSessionVoteNumber, closeSessionVoteNumber } = req.body;
        if (!deviceID || !marketId) return res.status(400).json({ success: false, message: 'All fields are required' });
        if ((!openSessionVoteNumber || openSessionVoteNumber.length === 0) && (!closeSessionVoteNumber || closeSessionVoteNumber.length === 0)) return res.status(400).json({ success: false, message: 'All fields are required' });
        if (!mongoose.Types.ObjectId.isValid(marketId)) return res.status(400).json({ success: false, message: "Invalid marketId" });
        const isMarket = await CreateMarketModel.findById(marketId);
        if (!isMarket) return res.status(400).json({ success: false, message: "Invalid Market" });
        const isGuestUser = await UserModel.findOne({ deviceID });
        if (!isGuestUser) return res.status(400).json({ success: false, message: 'User not found' });
        const isSameDay = (d1, d2) =>
            d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate();
        const today = new Date();
        const existingVote = isGuestUser.votes.find((item) => item.marketId.toString() === marketId && isSameDay(new Date(item.voteDate), today));
        if (existingVote) {
            if ((openSessionVoteNumber && existingVote.openSessionVoteNumber?.length > 0) || (closeSessionVoteNumber && existingVote.closeSessionVoteNumber?.length > 0)) {
                return res.status(400).json({ success: false, message: 'You can vote again after 12 AM' });
            }
            if (openSessionVoteNumber && (!existingVote.openSessionVoteNumber || existingVote.openSessionVoteNumber.length === 0)) {
                existingVote.openSessionVoteNumber = openSessionVoteNumber;
            }
            if (closeSessionVoteNumber && (!existingVote.closeSessionVoteNumber || existingVote.closeSessionVoteNumber.length === 0)) {
                existingVote.closeSessionVoteNumber = closeSessionVoteNumber;
            }
            await isGuestUser.save();
            return res.status(201).json({ success: true, data: isGuestUser, message: 'Vote successfully' });
        }
        const newVote = {
            marketId,
            voteDate: today
        };
        if (openSessionVoteNumber && openSessionVoteNumber.length > 0) { newVote.openSessionVoteNumber = openSessionVoteNumber; }
        if (closeSessionVoteNumber && closeSessionVoteNumber.length > 0) { newVote.closeSessionVoteNumber = closeSessionVoteNumber; }

        const alreadyVoted = isMarket.userVote.find(
            (item) =>
                item.user.toString() === isGuestUser._id.toString() &&
                item.votedAt.toISOString().split("T")[0] === today
        );

        if (!alreadyVoted) {
            isMarket.userVote.push({ user: isGuestUser._id, votedAt: new Date() });
            await isMarket.save();
        }
        isGuestUser.votes.push(newVote);
        await isGuestUser.save();
        return res.status(201).json({ success: true, data: isGuestUser, message: 'Vote successfully' });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

// user active 
const activeGuestUser = async (req, res) => {
    try {
        const thresholdDate = new Date(Date.now() - THRESHOLD_HOURS * 60 * 60 * 1000);
        const activeGuestUser = await UserModel.find({ lastLogin: { $gte: thresholdDate } });
        return res.status(200).json({ success: true, data: activeGuestUser.length });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

// user inactive 
const inActiveGuestUser = async (req, res) => {
    try {
        const thresholdDate = new Date(Date.now() - THRESHOLD_HOURS * 60 * 60 * 1000);
        const inActiveGuestUser = await UserModel.find({ lastLogin: { $lt: thresholdDate } });
        return res.status(200).json({ success: true, data: inActiveGuestUser.length });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}


module.exports = {
    guestUser,
    getAllGuestUser,
    guestUserVote,
    activeGuestUser,
    inActiveGuestUser,
    
}