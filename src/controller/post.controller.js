const mongoose = require("mongoose");
const PostModel = require("../model/Post.model");
const CreateMarketModel = require("../model/CreateMarket.model");
const GuesserModel = require("../model/Guesser.model");
const FormData = require("form-data");
const axios = require("axios");
const qs = require("qs");

// create Post
const createPost = async (req, res) => {
    try {
        if (!req.body) return res.status(400).json({ success: false, message: 'req.body not found' });
        const { GuesserMongooseID, marketId, session, single = [], jodi = [], pana = [], note } = req.body;
        if (!mongoose.Types.ObjectId.isValid(GuesserMongooseID) || !mongoose.Types.ObjectId.isValid(marketId) || !session) {
            return res.status(400).json({ success: false, message: 'Required fields missing' });
        }
        const isMarket = await CreateMarketModel.findById(marketId);
        if (!isMarket) return res.status(400).json({ success: false, message: 'Market not found' });
        const market = isMarket.marketName;
        // Valid session
        const validSessions = ['Open', 'Close'];
        if (!validSessions.includes(session)) {
            return res.status(400).json({ success: false, message: 'Invalid session' });
        }
        // === ❗Check if all three (single, jodi, pana) are empty ===
        if (
            (!single || single.length === 0) &&
            (!jodi || jodi.length === 0) &&
            (!pana || pana.length === 0)
        ) {
            return res.status(400).json({
                success: false,
                message: "At least one of Single, Jodi or Pana must have a value."
            });
        }
        // === ❗Check if already posted today for same marketId + session ===
        const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
        const existingPost = await PostModel.findOne({
            GuesserMongooseID,
            market,
            session,
            createdAt: {
                $gte: new Date(today + "T00:00:00.000Z"),
                $lte: new Date(today + "T23:59:59.999Z")
            }
        });
        if (existingPost) {
            return res.status(400).json({
                success: false,
                message: `You have already posted for ${session} session in this market today. Please try again tomorrow.`
            });
        }
        // ===== Validation =====
        if (session === 'Open') {
            if (single.some(n => n < 0 || n > 9)) return res.status(400).json({ message: 'Single numbers must be 1 digit each' });
            if (jodi.some(n => n < 10 || n > 99)) return res.status(400).json({ message: 'Jodi numbers must be 2 digits each' });
            if (pana.some(n => n < 100 || n > 999)) return res.status(400).json({ message: 'Pana numbers must be 3 digits each' });
            if (single.length > 4) return res.status(400).json({ message: 'Max 4 single numbers allowed' });
            if (jodi.length > 16) return res.status(400).json({ message: 'Max 16 jodi numbers allowed' });
            if (pana.length > 10) return res.status(400).json({ message: 'Max 10 pana numbers allowed' });
        }
        if (session === 'Close') {
            if (single.some(n => n < 0 || n > 9)) return res.status(400).json({ message: 'Single numbers must be 1 digit each' });
            if (pana.some(n => n < 100 || n > 999)) return res.status(400).json({ message: 'Pana numbers must be 3 digits each' });
            if (single.length > 4) return res.status(400).json({ message: 'Max 4 single numbers allowed' });
            if (pana.length > 9) return res.status(400).json({ message: 'Max 9 pana numbers allowed' });
        }
        // === Create Post ===
        let postData = { GuesserMongooseID, market, session, single, pana, note };
        if (session === 'Open') postData.jodi = jodi;
        const post = new PostModel(postData);
        // Market voting logic
        const alreadyVoted = isMarket.guesserVote.find(
            (item) =>
                item.guesser.toString() === GuesserMongooseID.toString() &&
                item.votedAt.toISOString().split("T")[0] === today
        );
        if (!alreadyVoted) {
            isMarket.guesserVote.push({ guesser: GuesserMongooseID, votedAt: new Date() });
            await isMarket.save();
        }
        await post.save();
        res.status(201).json({ success: true, message: "Posted Successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// GET all posts
const getAllPosts = async (req, res) => {
    try {
        const posts = await PostModel.find().populate('GuesserMongooseID', 'name email'); // Guesser info भी दिखा सकते हैं
        res.status(200).json({ success: true, posts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// GET post by ID
const getPostById = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await PostModel.findById(id).populate('GuesserMongooseID', 'name email');
        if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
        return res.status(200).json({ success: true, data: post });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Guesser Already posted ?
const guesserIsVotedOnMarket = async (req, res) => {
    try {
        const { marketId, guesserId } = req.body;
        if (!mongoose.Types.ObjectId.isValid(guesserId) || !mongoose.Types.ObjectId.isValid(marketId)) return res.status(400).json({ success: false, message: "guestUserId or marketId ID is Missing" });
        const isMarket = await CreateMarketModel.findById(marketId)
        const isGuesser = await GuesserModel.findById(guesserId);
        if (!isMarket || !isGuesser) return res.status(400).json({ success: false, message: "Market Or Guesser Not Exist" });
        const today = new Date().toISOString().split("T")[0];
        const alreadyVoted = isMarket.guesserVote.find(
            (item) =>
                item.guesser.toString() === guesserId.toString() &&
                item.votedAt.toISOString().split("T")[0] === today
        );
        if (!alreadyVoted) return res.status(404).json({ success: false, isVoted: false });
        const todaysPost = await PostModel.find({
            GuesserMongooseID: guesserId,
            market: isMarket.marketName,
            createdAt: {
                $gte: new Date(today + "T00:00:00.000Z"),
                $lte: new Date(today + "T23:59:59.999Z")
            }
        }).select("session")
        return res.status(200).json({ success: true, isVoted: true, data: todaysPost || null });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

// Step 1: Get API token
async function getApiToken(username, password) {
    try {
        const payload = qs.stringify({ username, password });
        const res = await axios.post(
            "https://matkawebhook.matka-api.online/get-refresh-token",
            payload,
            { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        );

        if (res.data?.status && res.data?.refresh_token) return res.data.refresh_token;
        throw new Error(JSON.stringify(res.data));
    } catch (err) {
        console.error("getApiToken Error:", err.message);
        throw err;
    }
}

// Step 2: Get Market Data
async function getMarketData(username, API_token, market_name, date) {
    try {
        const formData = new FormData();
        formData.append("username", username);
        formData.append("API_token", API_token);
        formData.append("markte_name", market_name);
        formData.append("date", date);

        const res = await axios.post(
            "https://matkawebhook.matka-api.online/market-data",
            formData,
            {
                headers: {
                    ...formData.getHeaders(),
                    Cookie: "ci_session=diooc980vjeqern5a9g6jq3oil0ep8he",
                },
            }
        );

        if (!res?.data?.old_result_starline || res?.data?.old_result_starline === 0) {
            return [];
        }

        return res.data.old_result_starline; // return only old_result_starline
    } catch (err) {
        console.error("getMarketData Error:", err.response?.data || err.message);
        throw new Error("Failed to fetch market data");
    }
}

// Step 3: Evaluate single post
async function evaluateSinglePost(post, username, password) {
    try {
        const yesterday = new Date();
        yesterday.setUTCHours(0, 0, 0, 0);
        yesterday.setUTCDate(yesterday.getUTCDate() - 1);
        const yyyy = yesterday.getUTCFullYear();
        const mm = String(yesterday.getUTCMonth() + 1).padStart(2, "0");
        const dd = String(yesterday.getUTCDate()).padStart(2, "0");
        const yesterdayStr = `${yyyy}-${mm}-${dd}`;

        const postDateStr = post.createdAt ? new Date(post.createdAt).toISOString().slice(0, 10) : null;
        if (postDateStr !== yesterdayStr) {
            post.result = ["Pending"];
            await post.save();
            return post.result;
        }

        const API_token = await getApiToken(username, password);
        const oldResultsStarline = await getMarketData(username, API_token, post.market, yesterdayStr);
        if (!oldResultsStarline.length) {
            post.result = ["Pending"];
            await post.save();
            return post.result;
        }

        const normalize = str => (str || "").trim().toUpperCase();
        const matchingMarkets = oldResultsStarline.filter(m => normalize(m.market_name) === normalize(post.market));
        if (!matchingMarkets.length) {
            post.result = ["Pending"];
            await post.save();
            return post.result;
        }

        let marketData = matchingMarkets.find(m => {
            const mDate = new Date(m.aankdo_date);
            const formatted = `${mDate.getFullYear()}-${String(mDate.getMonth() + 1).padStart(2, "0")}-${String(mDate.getDate()).padStart(2, "0")}`;
            return formatted === yesterdayStr;
        });

        if (!marketData) {
            marketData = matchingMarkets.sort((a, b) => new Date(b.aankdo_date) - new Date(a.aankdo_date))[0];
        }

        const toNumber = val => Number(String(val || "").trim());
        const figure_open = toNumber(marketData.figure_open);
        const figure_close = toNumber(marketData.figure_close);
        const aankdo_open = toNumber(marketData.aankdo_open);
        const aankdo_close = toNumber(marketData.aankdo_close);
        const jodi = toNumber(marketData.jodi);

        const singleArray = (post.single || []).map(toNumber);
        const panaArray = (post.pana || []).map(toNumber);
        const jodiArray = (post.jodi || []).map(toNumber);

        let wins = [];
        if (post.session === "Open") {
            if (singleArray.includes(figure_open)) wins.push(`Single Win (${figure_open})`);
            if (panaArray.includes(aankdo_open)) wins.push(`Pana Win (${aankdo_open})`);
            if (jodiArray.includes(jodi)) wins.push(`Jodi Win (${jodi})`);
        } else if (post.session === "Close") {
            if (singleArray.includes(figure_close)) wins.push(`Single Win (${figure_close})`);
            if (panaArray.includes(aankdo_close)) wins.push(`Pana Win (${aankdo_close})`);
        }

        post.result = wins.length ? wins : ["Loss"];
        await post.save();
        return post.result;

    } catch (err) {
        console.error("evaluateSinglePost Error:", err.message);
        post.result = ["Pending"];
        await post.save();
        return post.result;
    }
}

// Step 4: Get Yesterday Win Posts
const getYesterdayWinAllPosts = async (req, res) => {
    try {
        const username = "8168021120";
        const password = "Deepak@8562";

        const yesterday = new Date();
        yesterday.setUTCHours(0, 0, 0, 0);
        yesterday.setUTCDate(yesterday.getUTCDate() - 1);
        const yyyy = yesterday.getUTCFullYear();
        const mm = String(yesterday.getUTCMonth() + 1).padStart(2, "0");
        const dd = String(yesterday.getUTCDate()).padStart(2, "0");
        const yesterdayStr = `${yyyy}-${mm}-${dd}`;

        // Fetch all posts
        const posts = await PostModel.find().populate("GuesserMongooseID", "name email");

        // Evaluate each post
        for (let post of posts) {
            await evaluateSinglePost(post, username, password);
        }

        // Fetch updated posts and filter yesterday's wins
        const updatedPosts = await PostModel.find().populate("GuesserMongooseID", "name email");

        const filteredPosts = updatedPosts.filter(post => {
            const postDateStr = post.createdAt ? new Date(post.createdAt).toISOString().slice(0, 10) : null;
            const hasWin = Array.isArray(post.result) && post.result.some(r => r !== "Loss" && r !== "Pending");
            return postDateStr === yesterdayStr && hasWin;
        });

        return res.status(200).json({ success: true, posts: filteredPosts });

    } catch (error) {
        console.error("getYesterdayWinAllPosts Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

module.exports = { createPost, getAllPosts, getPostById, guesserIsVotedOnMarket, getYesterdayWinAllPosts };