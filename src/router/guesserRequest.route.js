const express = require('express');
const { guesserRequest, changeGuesserRequestStatus, getPendingGuesser, getApprovedGuessers, checkGuesserRequestStatus, getRejectedGuessers } = require('../controller/guesserRequest.controller');
const router = express.Router();

router.post('/guesser/request', async (req, res, next) => {
    try {
        await guesserRequest(req, res);
    } catch (error) {
        next(error);
    }
});

router.get('/guesser/request/check-status/:guestUserMongooseId', async (req, res, next) => {
    try {
        await checkGuesserRequestStatus(req, res);
    } catch (error) {
        next(error);
    }
});

router.put('/guesser/request/change/status/:guesserRequestId', async (req, res, next) => {
    try {
        await changeGuesserRequestStatus(req, res);
    } catch (error) {
        next(error);
    }
});

router.get('/guesser/request/get-pending', async (req, res, next) => {
    try {
        await getPendingGuesser(req, res);
    } catch (error) {
        next(error);
    }
});

router.get('/guesser/request/get-approved', async (req, res, next) => {
    try {
        await getApprovedGuessers(req, res);
    } catch (error) {
        next(error);
    }
});

router.get('/guesser/request/get-rejected', async (req, res, next) => {
    try {
        await getRejectedGuessers(req, res);
    } catch (error) {
        next(error);
    }
});

module.exports = router