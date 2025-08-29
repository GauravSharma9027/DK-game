const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ContactUsSchema = new Schema({
    guesserMongooseId: { type: mongoose.Schema.Types.ObjectId, ref: "GuesserModel", required: true },
    name: { type: String, required: true, trim: true },
    number: { type: Number, required: true, trim: true },
    message: { type: String, required: true, trim: true }
}, {
    timestamps: true,
});

module.exports = mongoose.model('ContactUsModel', ContactUsSchema);