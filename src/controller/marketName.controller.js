const MarketNameModel = require("../model/MarketName.model");

const addMarketName = async (req, res) => {
    try {
        if (!req.body) return res.status(400).json({ success: false, message: 'req.body not Found' });
        const { marketName } = req.body;
        if (!marketName) return res.status(400).json({ success: false, message: 'All fields are required' });
        await MarketNameModel.create({ marketName });
        return res.status(200).json({ success: true, message: 'Market Name Added Successfully' });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

const getMarketName = async (req, res) => {
    try {
        const marketNames = await MarketNameModel.find({});
        return res.status(200).json({ success: true, data: marketNames })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

const editMarketName = async (req, res) => {
    try {
        const marketId = req.params.marketId;
        if (!marketId) return res.status(404).json({ success: false, message: "Server Error (id nhi mili)" });
        const isMarketName = await MarketNameModel.findById(marketId);
        if (!isMarketName) return res.status(404).json({ success: false, message: "This Market Name is Not Exist, Please Add" });
        if (!req.body) return res.status(400).json({ success: false, message: 'req.body not Found' });
        const { marketName } = req.body
        if (!marketName) return res.status(400).json({ success: false, message: 'All fields are required' });
        isMarketName.marketName = marketName.trim()
        await isMarketName.save();
        return res.status(200).json({ success: true, message: 'Market Name Edit Successfully' });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

const deleteMarketName = async (req, res) => {
    try {
        const marketId = req.params.marketId;
        if (!marketId) return res.status(400).json({ success: false, message: "Market ID is required" });
        const isMarketName = await MarketNameModel.findById(marketId);
        if (!isMarketName) return res.status(404).json({ success: false, message: "This Market Name is Not Exist, Please Add" });
        await isMarketName.deleteOne();
        return res.status(200).json({ success: true, message: 'Market Name Edit Successfully' });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}


module.exports = {
    addMarketName,
    getMarketName,
    editMarketName,
    deleteMarketName,
}