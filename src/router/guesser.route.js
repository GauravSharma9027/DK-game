const express = require('express');
const { createGuesser, getAllGuesser, topTenGuesser, loginGuesser, logoutGuesser } = require('../controller/guesser.controller');
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


router.get('/guesser/get-top-ten', async (req, res, next) => {
    try {
        await topTenGuesser(req, res);
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