const express = require('express');
const { createMarket, editMarket, getAllMarket, deleteMarket } = require('../controller/createMarket.controller');
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
module.exports = router