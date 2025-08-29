const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "inactive"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("NoticeModel", noticeSchema);