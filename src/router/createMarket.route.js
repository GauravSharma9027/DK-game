const express = require('express');
const { createMarket, editMarket, getAllMarket, deleteMarket, guestUserIsVotedOnMarket, userVoteCountOnNumber } = require('../controller/createMarket.controller');
const router = express.Router();

router.post('/create/market', async (req, res, next) => {
    try {
        await createMarket(req, res);
    } catch (error) {
        next(error)
    }
});

router.get('/create/market/get-all', async (req, res, next) => {
    try {
        await getAllMarket(req, res);
    } catch (error) {
        next(error)
    }
});

router.put('/create/market/edit/:createdMarketId', async (req, res, next) => {
    try {
        await editMarket(req, res);
    } catch (error) {
        next(error)
    }
});

router.delete('/create/market/delete/:createdMarketId', async (req, res, next) => {
    try {
        await deleteMarket(req, res);
    } catch (error) {
        next(error)
    }
});

router.put('/create/market/guest-user/voted/:marketId/:guestUserId', async (req, res, next) => {
    try {
        await guestUserIsVotedOnMarket(req, res);
    } catch (error) {
        next(error)
    }
});

router.put('/create/market/guest-user/vote-count/:marketId', async (req, res, next) => {
    try {
        await userVoteCountOnNumber(req, res);
    } catch (error) {
        next(error)
    }
});

module.exports = router;