const PostModel = require("../model/Post.model");

const createPost = async (req, res) => {
    try {
        if (!req.body)
            return res.status(400).json({ success: false, message: 'req.body not found' });
        const { GuesserMongooseID, market, session, single = [], jodi = [], pana = [], note } = req.body;
        if (!GuesserMongooseID || !market || !session) {
            return res.status(400).json({ success: false, message: 'Required fields missing' });
        }

        // Session validation
        const validSessions = ['Open', 'Close'];
        if (!validSessions.includes(session)) {
            return res.status(400).json({ success: false, message: 'Invalid session' });
        }

        // Validation based on session
        if (session === 'Open') {
            if (single.some(n => n < 0 || n > 9)) return res.status(400).json({ message: 'Single numbers must be 1 digit each' });
            if (jodi.some(n => n < 10 || n > 99)) return res.status(400).json({ message: 'Jodi numbers must be 2 digits each' });
            if (pana.some(n => n < 100 || n > 999)) return res.status(400).json({ message: 'Pana numbers must be 3 digits each' });

            if (single.length > 4) return res.status(400).json({ message: 'Max 4 single numbers allowed' });
            if (jodi.length > 16) return res.status(400).json({ message: 'Max 16 jodi numbers allowed' });
            if (pana.length > 10) return res.status(400).json({ message: 'Max 10 pana numbers allowed' });

        } else if (session === 'Close') {
            if (single.some(n => n < 0 || n > 9)) return res.status(400).json({ message: 'Single numbers must be 1 digit each' });
            if (pana.some(n => n < 100 || n > 999)) return res.status(400).json({ message: 'Pana numbers must be 3 digits each' });

            if (single.length > 4) return res.status(400).json({ message: 'Max 4 single numbers allowed' });
            if (pana.length > 10) return res.status(400).json({ message: 'Max 10 pana numbers allowed' });
        }
        let post;
        if (session === 'Open') {
            post = new PostModel({
                GuesserMongooseID,
                market,
                session,
                single,
                jodi,
                pana,
                note
            });
        }
        if (session === 'Close') {
            post = new PostModel({
                GuesserMongooseID,
                market,
                session,
                single,
                pana,
                note
            });
        }


        await post.save();
        res.status(201).json({ success: true, message:"Posted Successfully" });

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
        res.status(200).json({ success: true, post });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = { createPost, getAllPosts, getPostById };
