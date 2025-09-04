// import { Router } from "express";
// import { loginSuperAdmin, getSuperAdminProfile, updateSuperAdminProfile, logoutSuperAdmin } from "../controllers/superAdmin.controller.js";
// import { verifySuperAdmin } from "../middleware/verifySuperAdmin.js";

// const router = Router();

// // router.post("/login", loginSuperAdmin);
// router.post('/admin/login', async (req, res, next) => {
//     try {
//         await loginSuperAdmin(req, res);
//     } catch (error) {
//         next(error)
//     }
// });
// router.use(verifySuperAdmin);
// // router.get("/me", getSuperAdminProfile);
// router.get('/admin/get-profile', async (req, res, next) => {
//     try {
//         await getSuperAdminProfile(req, res);
//     } catch (error) {
//         next(error)
//     }
// });

// // router.put("/me", updateSuperAdminProfile);
// router.put('/admin/update', async (req, res, next) => {
//     try {
//         await updateSuperAdminProfile(req, res);
//     } catch (error) {
//         next(error)
//     }
// });
// // router.post("/logout", logoutSuperAdmin);
// router.post('/admin/logout', async (req, res, next) => {
//     try {
//         await logoutSuperAdmin(req, res);
//     } catch (error) {
//         next(error)
//     }
// });

// export default router;
