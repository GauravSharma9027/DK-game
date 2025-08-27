const express = require('express');
const { addMarketName, editMarketName, deleteMarketName, getMarketName } = require('../controller/marketName.controller');
const router = express.Router();

router.post('/market/name/add', async (req, res, next) => {
    try {
        await addMarketName(req, res);
    } catch (error) {
        next(err);
    }
});

router.get('/market/name/get-all', async (req, res, next) => {
    try {
        await getMarketName(req, res);
    } catch (error) {
        next(err);
    }
});

router.put('/market/name/edit/:marketId', async (req, res, next) => {
    try {
        await editMarketName(req, res);
    } catch (error) {
        next(err);
    }
});

router.delete('/market/name/delete/:marketId', async (req, res, next) => {
    try {
        await deleteMarketName(req, res);
    } catch (error) {
        next(err);
    }
});
module.exports = router