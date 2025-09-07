const { default: mongoose } = require("mongoose");
const PostModel = require("../model/Post.model");
const CreateMarketModel = require("../model/CreateMarket.model");
const GuesserModel = require("../model/Guesser.model");

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
module.exports = { createPost, getAllPosts, getPostById, guesserIsVotedOnMarket };
