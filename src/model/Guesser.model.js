const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const guesserSchema = new Schema({
    realName: { type: String, required: true, trim: true },
    userGuestId: { type: String, required: true },
    guesserName: { type: String, required: true, trim: true },
    experience: { type: String, trim: true },
    whatsAppNumber: { type: Number, required: true, trim: true },
    password: { type: String, required: true, trim: true },
    isBlocked: { type: Boolean, enum: [true, false], default: false },
    voteByUser: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserModel', default: [] }],
    vote: { type: Number, required: true, trim: true, default: 0 },
    reason: { type: String, required: true, trim: true },
    status: { type: String, enum: ["Active", "InActive"], default: "Active", required: true }
}, {
    timestamps: true
});

module.exports = mongoose.model('GuesserModel', guesserSchema);