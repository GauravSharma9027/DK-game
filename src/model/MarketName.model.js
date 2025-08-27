const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const marketSchema = new Schema({
    marketName: { type: String, required: true, trim: true }
}, {
    timestamps: true
});

module.exports = mongoose.model('MarketNameModel', marketSchema);