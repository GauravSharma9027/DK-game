const mongoose = require("mongoose");
const GuesserRequestModel = require("../model/GuesserRequest.model");
const UserModel = require("../model/User.model");

const guesserRequest = async (req, res) => {
    try {
        if (!req.body) return res.status(400).json({ success: false, message: 'req.body not Found' });
        const { realName, userMongooseId, guesserName, whatsAppNumber, reason } = req.body;
        if (!realName || !userMongooseId || !guesserName || !whatsAppNumber || !reason) return res.status(400).json({ success: false, message: 'All fields are required' });
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

// get status
const checkGuesserRequestStatus = async (req, res) => {
    try {
        const guestUserMongooseId = req.params.guestUserMongooseId;
        if (!guestUserMongooseId || !mongoose.Types.ObjectId.isValid(guestUserMongooseId)) return res.status(400).json({ success: false, message: 'guestUserMongoose Id not Found or Not Valid Id' });
        const isRequestedGuestUser = await GuesserRequestModel.findOne({ userMongooseId: guestUserMongooseId });
        if (!isRequestedGuestUser) return res.status(400).json({ success: false, message: 'No Any Request For Become a Guesser' });
        const currentStatus = isRequestedGuestUser.status;
        return res.status(200).json({ success: true, data: currentStatus });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

// change Status
const changeGuesserRequestStatus = async (req, res) => {
    try {
        const guesserRequestId = req.params.guesserRequestId;
        if (!guesserRequestId || !mongoose.Types.ObjectId.isValid(guesserRequestId)) return res.status(400).json({ success: false, message: 'guesserRequest Id not Found ' });
        if (!req.body.status) return res.status(400).json({ success: false, message: 'req.body.status not Found' });
        const { status } = req.body;
        if (status === "rejected" || status === "approved") {
            const isGuesserRequest = await GuesserRequestModel.findById(guesserRequestId);
            if (!isGuesserRequest) return res.status(404).json({ success: false, message: 'This Guesser Request is not Found' });
            if (isGuesserRequest.status === "rejected" || isGuesserRequest.status === "approved") return res.status(400).json({ success: false, message: 'Guesser Request status already updated' });
            isGuesserRequest.status = status;
            // isGuesserRequest.credentialCreated = "created";
            isGuesserRequest.save();
            return res.status(200).json({ success: true, message: 'Status Updated Successfully' });
        }
        return res.status(400).json({ success: false, message: 'miss match value' })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

// Get All Approved Guesser Requests
const getPendingGuesser = async (req, res) => {
    try {
        const pendingRequests = await GuesserRequestModel.find({ status: "pending" });
        return res.status(200).json({ success: true, data: pendingRequests });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

// Get All Approved Guesser Requests
const getApprovedGuessers = async (req, res) => {
    try {
        const approvedRequests = await GuesserRequestModel.find({ status: "approved", credentialCreated: "notCreated" }).sort({ createdAt: -1 });
        return res.status(200).json({ success: true, data: approvedRequests });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

// Get All Rejected Guesser Requests
const getRejectedGuessers = async (req, res) => {
    try {
        const rejectedRequests = await GuesserRequestModel.find({ status: "rejected",credentialCreated: "notCreated" }).sort({ createdAt: -1 });
        return res.status(200).json({ success: true, data: rejectedRequests });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

module.exports = {
    guesserRequest,
    changeGuesserRequestStatus,
    getPendingGuesser,
    getApprovedGuessers,
    getRejectedGuessers,
    checkGuesserRequestStatus
}