const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const createMarketSchema = new Schema({
    marketName: { type: String, required: true, trim: true },
    openSession: { type: String, required: true, match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]\s?(AM|PM)?$/, },
    closeSession: { type: String, required: true, match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]\s?(AM|PM)?$/, },
    accountType: { type: String, enum: ["Guesser", "User"], required: true, },
    status: { type: String, enum: ["Active", "InActive"], required: true },
}, {
    timestamps: true,
});

module.exports = mongoose.model('CreateMarket', createMarketSchema);