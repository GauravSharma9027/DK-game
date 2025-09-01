const mongoose = require("mongoose");
const NoticeModel = require("../model/Notice.model");
const { getIo } = require("../utils/socket.utils");

const createNotice = async (req, res) => {
    try {
        if (!req.body) return res.status(400).json({ success: false, message: "req.body is required" });
        const { message } = req.body;
        if (!message) return res.status(400).json({ success: false, message: "Message is required" });
        await NoticeModel.create({ message });
        return res.status(201).json({ success: true, message: "Notice Added Successfully" });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

const toggleNoticeStatus = async (req, res) => {
    try {
        const noticeId = req.params.noticeId;
        if (!noticeId || !mongoose.Types.ObjectId.isValid(noticeId)) return res.status(400).json({ success: false, message: "Notification ID is required || Not Valid", });
        // Step 1: Check if requested notification exists
        const requestedNotice = await NoticeModel.findById(noticeId);
        if (!requestedNotice) return res.status(404).json({ success: false, message: "Notice not found", });
        if (requestedNotice.status === "active") return res.status(200).json({ success: false, message: "Already Active", });
        // Step 2: Find currently active notification
        const currentActive = await NoticeModel.findOne({ status: "active" });
        // Step 3: If another notification is active, deactivate it
        if (currentActive && currentActive._id.toString() !== noticeId) {
            await NoticeModel.findByIdAndUpdate(currentActive._id, {
                status: "inactive",
            });
        }
        // Step 4: Activate requested notification
        requestedNotice.status = "active";
        await requestedNotice.save();
        // Step 5: Emit real-time update (only one active at a time)
        const io = getIo();
        io.emit("requestedNotice", requestedNotice);
        return res.status(200).json({ success: true, message: "requestedNotice status updated successfully", data: requestedNotice, });
    } catch (error) {
        console.error("Error in toggleNotificationStatus:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

const getActiveNotice = async (req, res) => {
    try {
        const activeNotice = await NoticeModel.findOne({ status: "active" });
        if (!activeNotice) return res.status(404).json({ success: false, message: "No active notice found" });
        return res.status(200).json({ success: true, message: "Active notice fetched successfully", data: activeNotice.message });
    } catch (error) {
        console.error("Error in getActiveNotice:", error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

const getAllNotice = async (req, res) => {
    try {
        const Notices = await NoticeModel.find();
        return res.status(200).json({ success: true, data: Notices });
    } catch (error) {
        console.error("Error in getActiveNotice:", error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
}
module.exports = {
    createNotice,
    toggleNoticeStatus,
    getActiveNotice,
    getAllNotice
}