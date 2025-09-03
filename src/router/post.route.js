const express = require('express');
const { createPost, getAllPosts, guesserIsVotedOnMarket } = require('../controller/post.controller');
const router = express.Router();

router.post('/post/create', async (req, res, next) => {
    try {
        await createPost(req, res);
    } catch (error) {
        next(error)
    }
});

router.get('/post/get-all', async (req, res, next) => {
    try {
        await getAllPosts(req, res);
    } catch (error) {
        next(error)
    }
});


router.put('/post/guesser/posted/:marketId/:guesserId', async (req, res, next) => {
    try {
        await guesserIsVotedOnMarket(req, res);
    } catch (error) {
        next(error)
    }
});

module.exports = router
