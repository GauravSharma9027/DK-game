const express = require('express');
const { guesserRequest, changeGuesserRequestStatus, getPendingGuesser, getApprovedGuessers } = require('../controller/guesserRequest.controller');
const router = express.Router();

// !realName || !userMongooseId || !guesserName || !experience || !whatsAppNumber(type:number) || !reason
router.post('/guesser/request', async (req, res, next) => {
    try {
        await guesserRequest(req, res);
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

module.exports = router