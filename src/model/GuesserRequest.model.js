const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const guesserRequestSchema = new Schema({
    userMongooseId: { type: mongoose.Schema.Types.ObjectId, ref: "UserModel", required: true },
    realName: { type: String, required: true, trim: true },
    userGuestId: { type: String, required: true },
    guesserName: { type: String, required: true, trim: true },
    experience: { type: String, required: true, trim: true },
    whatsAppNumber: { type: Number, required: true, trim: true },
    reason: { type: String, required: true, trim: true },
    Status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending", required: true }
}, {
    timestamps: true,
});

module.exports = mongoose.model('GuesserRequestModel', guesserRequestSchema);