const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const guesserRequestSchema = new Schema({
    userMongooseId: { type: mongoose.Schema.Types.ObjectId, ref: "UserModel", required: true },
    realName: { type: String, required: true, trim: true },
    userGuestId: { type: String, required: true },
    guesserName: { type: String, required: true, trim: true },
    experience: { type: String, trim: true },
    whatsAppNumber: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        validate: {
            validator: function (v) {
                return /^\+?[0-9]{10,15}$/.test(v);
            },
            message: props => `${props.value} is not a valid WhatsApp number!`
        }
    },
    reason: { type: String, required: true, trim: true },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending", required: true }
}, {
    timestamps: true,
});

module.exports = mongoose.model('GuesserRequestModel', guesserRequestSchema);