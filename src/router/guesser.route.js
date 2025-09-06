const express = require('express');
const { createGuesser, getAllGuesser, topTenGuesser, loginGuesser, logoutGuesser, changePassword, getGuesserPost, userVoteOnGuesser, userIsVotedOnGuesser, getAllGuesserCount } = require('../controller/guesser.controller');
const router = express.Router();

// deviceID
router.post('/guesser/create', async (req, res, next) => {
    try {
        await createGuesser(req, res);
    } catch (err) {
        next(err);
    }
});

router.get('/guesser/get-all', async (req, res, next) => {
    try {
        await getAllGuesser(req, res);
    } catch (err) {
        next(err);
    }
});

router.get('/guesser/get-all/count', async (req, res, next) => {
    try {
        await getAllGuesserCount(req, res);
    } catch (err) {
        next(err);
    }
});

router.post('/guesser/post/:guesserId', async (req, res, next) => {
    try {
        await getGuesserPost(req, res);
    } catch (err) {
        next(err);
    }
});

router.post('/guesser/vote-by-user', async (req, res, next) => {
    try {
        await userVoteOnGuesser(req, res);
    } catch (err) {
        next(err);
    }
});

router.post('/guesser/user-isVoted', async (req, res, next) => {
    try {
        await userIsVotedOnGuesser(req, res);
    } catch (err) {
        next(err);
    }
});

router.get('/guesser/get-top-ten', async (req, res, next) => {
    try {
        await topTenGuesser(req, res);
    } catch (err) {
        next(err);
    }
});

router.post('/guesser/change-password', async (req, res, next) => {
    try {
        await changePassword(req, res);
    } catch (err) {
        next(err);
    }
});

router.post('/guesser/login', async (req, res, next) => {
    try {
        await loginGuesser(req, res);
    } catch (err) {
        next(err);
    }
});

router.post('/guesser/logout', async (req, res, next) => {
    try {
        await logoutGuesser(req, res);
    } catch (err) {
        next(err);
    }
});

module.exports = router