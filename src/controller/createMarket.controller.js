const CreateMarket = require("../model/CreateMarket.model");

const createMarket = async (req, res) => {
    try {
        if (!req.body) return res.status(400).json({ success: false, message: 'req.body not Found' });
        const { marketName, openSession, closeSession, accountType, status } = req.body;
        if (!marketName || !openSession || !closeSession || !accountType || !status) return res.status(400).json({ success: false, message: 'All fields are required' });
        await CreateMarket.create({ marketName, openSession, closeSession, accountType, status });
        return res.status(200).json({ success: true, message: 'Market Create Successfully' });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

const getAllMarket = async (req, res) => {
    try {
        const markets = await CreateMarket.find({});
        return res.status(200).json({ success: true, data: markets })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

const editMarket = async (req, res) => {
    try {
        const createdMarketId = req.params.createdMarketId;
        if (!createdMarketId) return res.status(400).json({ success: false, message: "Market ID is required" });
        if (!req.body) return res.status(400).json({ success: false, message: 'req.body not Found' });
        const isCreatedMarket = await CreateMarket.findById(createdMarketId);
        if (!isCreatedMarket) return res.status(400).json({ success: false, message: 'Market not Found' });
        const { marketName, openSession, closeSession, accountType, status } = req.body;
        if (!marketName && !openSession && !closeSession && !accountType && !status) return res.status(400).json({ success: false, message: 'One fields are required' });
        if (marketName) isCreatedMarket.marketName = marketName;
        if (openSession) isCreatedMarket.openSession = openSession;
        if (closeSession) isCreatedMarket.closeSession = closeSession;
        if (accountType) isCreatedMarket.accountType = accountType;
        if (status) isCreatedMarket.status = status;
        await isCreatedMarket.save();
        return res.status(200).json({ success: true, message: 'Market Updated Successfully' });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

const deleteMarket = async (req, res) => {
    try {
        const createdMarketId = req.params.createdMarketId;
        if (!createdMarketId) return res.status(400).json({ success: false, message: "Market ID is required" });
        const deletedMarket = await CreateMarket.findByIdAndDelete(createdMarketId);
        if (!deletedMarket) return res.status(404).json({ success: false, message: "Market not found" });
        return res.status(200).json({ success: true, message: 'Market Delete Successfully' })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

module.exports = {
    createMarket,
    getAllMarket,
    editMarket,
    deleteMarket,
}