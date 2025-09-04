const express = require('express')
const { loginSuperAdmin, getSuperAdminProfile, updateSuperAdminProfile, logoutSuperAdmin, updateSuperAdminName, updateSuperAdminPassword } = require('../controller/superAdmin.controller.js');
const verifySuperAdmin = require('../middleware/verifySuperAdmin.middleware.js');
const router = express.Router();

router.post('/admin/login', async (req, res, next) => {
    try {
        await loginSuperAdmin(req, res);
    } catch (error) {
        next(error)
    }
});
router.use(verifySuperAdmin);

router.get('/admin/get-profile/:adminId', async (req, res, next) => {
    try {
        await getSuperAdminProfile(req, res);
    } catch (error) {
        next(error)
    }
});


// router.put('/admin/update', async (req, res, next) => {
//     try {
//         await updateSuperAdminProfile(req, res);
//     } catch (error) {
//         next(error)
//     }
// });

router.put('/admin/name/update', async (req, res, next) => {
    try {
        await updateSuperAdminName(req, res);
    } catch (error) {
        next(error)
    }
});

router.put('/admin/password/update', async (req, res, next) => {
    try {
        await updateSuperAdminPassword(req, res);
    } catch (error) {
        next(error)
    }
});

router.post('/admin/logout', async (req, res, next) => {
    try {
        await logoutSuperAdmin(req, res);
    } catch (error) {
        next(error)
    }
});

module.exports = router
