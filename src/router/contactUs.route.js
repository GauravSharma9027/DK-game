const express = require('express');
const { createContact, getAllContact } = require('../controller/contactUs.controller');
const router = express.Router();

router.post('/contact/us', async (req, res, next) => {
    try {
        await createContact(req, res);
    } catch (error) {
        next(error)
    }
});

router.get('/contact/get-all', async (req, res, next) => {
    try {
        await getAllContact(req, res);
    } catch (error) {
        next(error)
    }
});

module.exports = router