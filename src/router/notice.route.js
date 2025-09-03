const express = require('express');
const { createNotice, getActiveNotice, toggleNoticeStatus, getAllNotice, deleteNotice } = require('../controller/notice.controller');
const router = express.Router();

router.post('/notice/create', async (req, res, next) => {
    try {
        await createNotice(req, res);
    } catch (error) {
        next(error)
    }
});

router.put('/notice/change/status/:noticeId', async (req, res, next) => {
    try {
        await toggleNoticeStatus(req, res);
    } catch (error) {
        next(error)
    }
});

router.get('/notice/get-active', async (req, res, next) => {
    try {
        await getActiveNotice(req, res);
    } catch (error) {
        next(error)
    }
});

router.get('/notice/get-All', async (req, res, next) => {
    try {
        await getAllNotice(req, res);
    } catch (error) {
        next(error)
    }
});

router.delete('/notice/delete/:noticeId', async (req, res, next) => {
    try {
        await deleteNotice(req, res);
    } catch (error) {
        next(error)
    }
});
module.exports = router