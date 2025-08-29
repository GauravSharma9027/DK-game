const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    GuesserMongooseID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'GuesserModel',
        required: true
    },
    market: {
        type: String,
        required: true
    },
    session: {
        type: String,
        enum: ['Open', 'Close'],
        required: true
    },
    single: {
        type: [Number],
        default: [],
        validate: {
            validator: function (nums) {
                return nums.every(num => num >= 0 && num <= 9);
            },
            message: 'Single numbers must be 1 digit each'
        }
    },
    jodi: {
        type: [Number],
        default: [],
        validate: {
            validator: function (nums) {
                return nums.every(num => num >= 10 && num <= 99);
            },
            message: 'Jodi numbers must be 2 digits each'
        }
    },
    pana: {
        type: [Number],
        default: [],
        validate: {
            validator: function (nums) {
                return nums.every(num => num >= 100 && num <= 999);
            },
            message: 'Pana numbers must be 3 digits each'
        }
    },
    note: {
        type: String,
        required: false
    }
}, { timestamps: true });

module.exports = mongoose.model('PostModel', postSchema);
