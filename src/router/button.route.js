const express = require('express');
const { getAllButtons, buttonVisible, updateButton } = require('../controller/button.controller');
const router = express.Router();

router.get('/button/get-all', async (req, res, next) => {
    try {
        await getAllButtons(req, res);
    } catch (error) {
        next(error)
    }
});

router.put('/button/visible/:buttonId', async (req, res, next) => {
    try {
        await buttonVisible(req, res);
    } catch (error) {
        next(error)
    }
});

router.put('/button/edit', async (req, res, next) => {
    try {
        await updateButton(req, res);
    } catch (error) {
        next(error)
    }
});



module.exports = router
