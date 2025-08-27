const GuesserRequestModel = require("../model/GuesserRequest.model");
const UserModel = require("../model/User.model");

const guesserRequest = async (req, res) => {
    try {
        if (!req.body) return res.status(400).json({ success: false, message: 'req.body not Found' });
        const { realName, userMongooseId, guesserName, experience, whatsAppNumber, reason } = req.body;
        if (!realName || !userMongooseId || !guesserName || !experience || !whatsAppNumber || !reason) return res.status(400).json({ success: false, message: 'All fields are required' });
        const isGuesser = await GuesserRequestModel.findOne({ userMongooseId: userMongooseId });
        if (isGuesser) return res.status(404).json({ success: false, message: "You Already Registered, Please Login" });
        const isUser = await UserModel.findById(userMongooseId);
        if (!isUser) return res.status(404).json({ success: false, message: "User not found" });
        req.body.userGuestId = isUser.userGuestId;
        await GuesserRequestModel.create(req.body);
        return res.status(201).json({ success: true, message: "Guesser Request Created Successfully" });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

 

const getPendingGuesser = async (req, res) => {
    try {
        const pendingRequests = await GuesserRequestModel.find({ status: "pending" });
        return res.status(200).json({ success: true, data: pendingRequests });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Get All Approved Guesser Requests
const getApprovedGuessers = async (req, res) => {
    try {
        const approvedRequests = await GuesserRequestModel.find({ status: "approved" });
        return res.status(200).json({ success: true, data: approvedRequests });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

module.exports = {
    guesserRequest,
    getPendingGuesser,
    getApprovedGuessers,
}