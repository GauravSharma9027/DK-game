const GuesserModel = require("../model/Guesser.model");
const GuesserRequestModel = require("../model/GuesserRequest.model");
const jwtGenerate = require('../utils/jwt.generate.utils');
const bcrypt = require("bcryptjs");
const saltRounds = Number(process.env.SALT_ROUNDS) || 10;

const createGuesser = async (req, res) => {
    try {
        if (!req.body) return res.status(400).json({ success: false, message: 'req.body not Found' });
        const { guesserRequestId, password } = req.body;
        if (!guesserRequestId || !password) return res.status(400).json({ success: false, message: 'All fields are required' });
        const isGuesserRequest = await GuesserRequestModel.findById(guesserRequestId);
        if (!isGuesserRequest) return res.status(400).json({ success: false, message: 'Not Found Any Requested Become A Guesser' });
        if (isGuesserRequest.status !== "approved") return res.status(400).json({ success: false, message: 'This Request Is Not Approve For Become A Guesser ' });
        const alreadyGuesser = await GuesserModel.findOne({ whatsAppNumber: isGuesserRequest.whatsAppNumber });
        if (alreadyGuesser) return res.status(400).json({ success: false, message: 'This user is already a Guesser' });
        const hashedPassword = bcrypt.hashSync(password, saltRounds);
        const newGuesser = new GuesserModel({
            realName: isGuesserRequest.realName,
            userGuestId: isGuesserRequest.userGuestId,
            guesserName: isGuesserRequest.guesserName,
            experience: isGuesserRequest.experience,
            whatsAppNumber: isGuesserRequest.whatsAppNumber,
            reason: isGuesserRequest.reason,
            password: hashedPassword
        });
        await GuesserModel.create(newGuesser);
        return res.status(201).json({ success: true, message: "Guesser created successfully" });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

const getAllGuesser = async (req, res) => {
    try {
        const Guessers = await GuesserModel.find().select("-password -__v -voteByUser");
        return res.status(200).json({ success: true, data: Guessers });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

const topTenGuesser = async (req, res) => {
    try {
        const Guessers = await GuesserModel.find().select("-password -__v -voteByUser").sort({ vote: -1 }).limit(10)
        return res.status(200).json({ success: true, data: Guessers });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

const loginGuesser = async (req, res) => {
    try {
        const { whatsAppNumber, password } = req.body;
        if (!whatsAppNumber || !password) return res.status(400).json({ success: false, message: "All field is Required." });
        const isGuesser = await GuesserModel.findOne({ whatsAppNumber: whatsAppNumber });
        if (!isGuesser) return res.status(400).json({ success: false, message: "Number is Not Registered." });
        const IsMatched = bcrypt.compareSync(password, isGuesser.password);
        if (!IsMatched) return res.status(400).json({ success: false, message: "Password Is Wrong" });
        const payload = {
            guesserId: isGuesser._id,
            whatsAppNumber: isGuesser.whatsAppNumber,
        }
        const token = jwtGenerate(payload);
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "Lax",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7d * 24h * 60m * 60s * 1000ms
        })
        return res.status(200).json({ success: true, message: "Login Successfully" })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

const logoutGuesser = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: false,
            sameSite: "Lax"
        });
        return res.status(200).json({ success: true, message: "Logout Successfully" });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


module.exports = {
    createGuesser,
    getAllGuesser,
    topTenGuesser,
    loginGuesser,
    logoutGuesser,
}