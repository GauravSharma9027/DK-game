const express = require('express');
const { createPost, getAllPosts, guesserIsVotedOnMarket, getYesterdayWinAllPosts } = require('../controller/post.controller');
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

router.post('/post/guesser/posted', async (req, res, next) => {
    try {
        await guesserIsVotedOnMarket(req, res);
    } catch (error) {
        next(error)
    }
});

router.get('/post/get-all-yesterday-win', async (req, res, next) => {
    try {
        await getYesterdayWinAllPosts(req, res);
    } catch (error) {
        next(error)
    }
});


module.exports = router;
