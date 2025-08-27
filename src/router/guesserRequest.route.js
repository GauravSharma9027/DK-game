const express = require('express');
const { guesserRequest } = require('../controller/guesserRequest.controller');
const router = express.Router();

// !realName || !userMongooseId || !guesserName || !experience || !whatsAppNumber(type:number) || !reason
router.post('/guesser/request', async (req, res, next) => {
    try {
        await guesserRequest(req, res);
    } catch (error) {
        next(error)
    }
});

module.exports = router