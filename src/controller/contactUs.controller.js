const mongoose = require("mongoose");
const ContactUsModel = require("../model/ContactUs.model");
const GuesserModel = require("../model/Guesser.model");

const createContact = async (req, res) => {
    try {
        if (!req.body) return res.status(400).json({ success: false, message: 'req.body not Found' });
        const { guesserMongooseId, name, number, message } = req.body;
        if (!guesserMongooseId || !name || !number || !message) return res.status(400).json({ success: false, message: 'All fields are required' });
        if (!mongoose.Types.ObjectId.isValid(guesserMongooseId)) return res.status(400).json({ success: false, message: 'Not Valid Mongoose Id' });
        const isGuesser = await GuesserModel.findOne({ _id: guesserMongooseId });
        if (!isGuesser) return res.status(403).json({ success: false, message: 'You are not allowed to send a message' });
        await ContactUsModel.create(req.body);
        return res.status(200).json({ success: true, message: 'Sent Successfully' });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

const getAllContact = async (req, res) => {
    try {
        const contacts = await ContactUsModel.find()
            .sort({ createdAt: -1 }); // newest first

        return res.status(200).json({ success: true, data: contacts });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};


module.exports = {
    createContact,
    getAllContact,
}