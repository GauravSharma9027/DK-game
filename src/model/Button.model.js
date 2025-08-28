const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const buttonSchema = new Schema({
    SNo: { type: Number, required: true },
    buttonName: { type: String, required: true, trim: true },
    buttonLink: { type: String, default: null, trim: true },
    visible: { type: Boolean, required: true, enum: [true, false], default: true },
}, {
    timestamps: true
});

module.exports = mongoose.model('buttonModel', buttonSchema);


