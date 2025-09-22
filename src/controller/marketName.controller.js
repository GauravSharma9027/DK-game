
const MarketNameModel = require('../model/marketName.model');

// const addMarketName = async (req, res) => {
//     try {
//         if (!req.body) return res.status(400).json({ success: false, message: 'req.body not Found' });
//         const { marketName } = req.body;
//         if (!marketName) return res.status(400).json({ success: false, message: 'All fields are required' });
//         await MarketNameModel.create({ marketName });
//         return res.status(200).json({ success: true, message: 'Add Successfully' });
//     } catch (error) {
//         console.log(error.message);
//         return res.status(500).json({ success: false, message: 'Internal Server Error' });
//     }
// }

const axios = require('axios');
// Controller to fetch all market names
const FormData = require("form-data");

const getMarketName = async (req, res) => {
    try {
        // FormData banaye
        const formData = new FormData();
        formData.append("username", "8168021120");
        formData.append("API_token", "your_token_here");

        // POST request with multipart/form-data
        const response = await axios.post(
            "https://matkawebhook.matka-api.online/market-mapping",
            formData,
            {
                headers: {
                    ...formData.getHeaders(), // Important! Axios ko boundary aur content-type dikhao
                    Cookie: "ci_session=um52lorcoodqgbb61s9n4buke63sca38", // Agar session cookie required hai
                },
                timeout: 20000,
            }
        );

        if (!response || !response.data) {
            return res.status(502).json({ success: false, message: "Invalid response from third-party API" });
        }
        const flattenedData = response.data.result.flat();
        const marketNames = flattenedData.map(item => ({ market_name: item.market_name }));
        return res.status(200).json({ success: true, data: marketNames });
    } catch (err) {
        console.error("Error in getMarketName:", err.message);
        if (err.response) {
            return res.status(err.response.status).json({
                message: err.response.data?.message || "Error from third-party API",
                data: err.response.data || null,
            });
        }

        if (err.request) {
            return res.status(504).json({ message: "No response received from third-party API" });
        }

        return res.status(500).json({ message: "Internal server error", error: err.message });
    }
};

// const getMarketName = async (req, res) => {
//     try {
//         const marketNames = await MarketNameModel.find({}).sort({ createdAt: -1 });
//         return res.status(200).json({ success: true, data: marketNames })
//     } catch (error) {
//         console.log(error.message);
//         return res.status(500).json({ success: false, message: 'Internal Server Error' });
//     }
// }

// const editMarketName = async (req, res) => {
//     try {
//         const marketId = req.params.marketId;
//         if (!marketId) return res.status(404).json({ success: false, message: "Server Error (id nhi mili)" });
//         const isMarketName = await MarketNameModel.findById(marketId);
//         if (!isMarketName) return res.status(404).json({ success: false, message: "This Market Name is Not Exist, Please Add" });
//         if (!req.body) return res.status(400).json({ success: false, message: 'req.body not Found' });
//         const { marketName } = req.body
//         if (!marketName) return res.status(400).json({ success: false, message: 'All fields are required' });
//         isMarketName.marketName = marketName.trim()
//         await isMarketName.save();
//         return res.status(200).json({ success: true, message: ' Update Successfully' });
//     } catch (error) {
//         console.log(error.message);
//         return res.status(500).json({ success: false, message: 'Internal Server Error' });
//     }
// }

// const deleteMarketName = async (req, res) => {
//     try {
//         const marketId = req.params.marketId;
//         if (!marketId) return res.status(400).json({ success: false, message: "Market ID is required" });
//         const isMarketName = await MarketNameModel.findById(marketId);
//         if (!isMarketName) return res.status(404).json({ success: false, message: "This Market Name is Not Exist, Please Add" });
//         await isMarketName.deleteOne();
//         return res.status(200).json({ success: true, message: 'Delete Successfully' });
//     } catch (error) {
//         console.log(error.message);
//         return res.status(500).json({ success: false, message: 'Internal Server Error' });
//     }
// }


module.exports = {
    // addMarketName,
    getMarketName,
    // editMarketName,
    // deleteMarketName,
}