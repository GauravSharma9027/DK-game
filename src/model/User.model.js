const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    userGuestId: { type: String, required: true, unique: true },
    deviceID: { type: String, required: true, unique: true },
    lastLogin: { type: Date, default: () => new Date() },
    votes: [{
        marketId: { type: mongoose.Schema.Types.ObjectId, ref: 'MarketModel' },
        openSessionVoteNumber: { type: [Number] },
        closeSessionVoteNumber: { type: [Number] }
    }]
}, {
    timestamps: true
})

module.exports = mongoose.model('UserModel', userSchema);