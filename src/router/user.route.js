const express = require('express');
const { guestUser, guestUserVote, getAllGuestUser, activeGuestUser, inActiveGuestUser, getMarketVotes } = require('../controller/user.controller');
const router = express.Router();

// deviceID
router.post('/guest/user', async (req, res, next) => {
    try {
        await guestUser(req, res);
    } catch (err) {
        next(err);
    }
});

router.get('/guest/user/get-all', async (req, res, next) => {
    try {
        await getAllGuestUser(req, res);
    } catch (error) {
        next(err);
    }
})

router.post('/guest/user/vote', async (req, res, next) => {
    try {
        await guestUserVote(req, res);
    } catch (error) {
        next(err);
    }
});

router.get('/guest/user/active', async (req, res, next) => {
    try {
        await activeGuestUser(req, res);
    } catch (error) {
        next(err);
    }
});

router.get('/guest/user/inactive', async (req, res, next) => {
    try {
        await inActiveGuestUser(req, res);
    } catch (error) {
        next(err);
    }
});

router.post('/guest/user/votes-on-market', async (req, res, next) => {
    try {
        await getMarketVotes(req, res);
    } catch (error) {
        next(error);
    }
});

module.exports = router