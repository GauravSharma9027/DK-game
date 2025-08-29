const express = require('express');
const { createPost, getAllPosts } = require('../controller/post.controller');
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


module.exports = router
