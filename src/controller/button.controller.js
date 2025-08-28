const ButtonModel = require("../model/Button.model");

// Seed data
const buttonArray = [
    { SNo: 1, buttonName: "Get VIP", buttonLink: "https://example.com/submit", visible: true },
    { SNo: 2, buttonName: "Share App", buttonLink: "https://example.com/cancel", visible: true },
    { SNo: 3, buttonName: "User Voting", visible: true },
    { SNo: 4, buttonName: "Become Guesser", visible: true },
    { SNo: 5, buttonName: "Login Guesser", visible: true },
    { SNo: 6, buttonName: "Download App", buttonLink: "https://example.com/upload", visible: true },
    { SNo: 7, buttonName: "YouTube Channel", buttonLink: "https://example.com/login", visible: true },
    { SNo: 8, buttonName: "All Guessers", visible: true },
];

const createButton = async (req, res) => {
    try {
        const count = await ButtonModel.countDocuments();
        if (count > 0) return;
        await ButtonModel.insertMany(buttonArray);
        console.log("Buttons seeded successfully");
    } catch (error) {
        console.error("Button Seed Error:", error.message);
    }
};

const getAllButtons = async (req, res) => {
    try {
        const buttons = await ButtonModel.find().sort({ SNo: 1 });
        if (!buttons || buttons.length === 0) return res.status(404).json({ success: false, message: "No buttons found" });
        return res.status(200).json({ success: true, data: buttons });
    } catch (error) {
        console.error("Get All Buttons Error:", error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const buttonVisible = async (req, res) => {
    try {
        const buttonId = req.params.buttonId;
        if (!buttonId) return res.status(300).json({ success: false, message: "Button Not Found" });
        const isButton = await ButtonModel.findById(buttonId)
        const isVisible = isButton.visible;
        if (isVisible) {
            isButton.visible = false;
            await isButton.save();
            return res.status(200).json({ success: true, message: "Button is Hidden Successfully" });
        }
        isButton.visible = true;
        await isButton.save();
        return res.status(200).json({ success: true, message: "Button is Visible Successfully" });
    } catch (error) {
        console.error("buttonVisible Error:", error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

// changeButtonName
// changeButtonLink

module.exports = {
    createButton,
    getAllButtons,
    buttonVisible,
}

