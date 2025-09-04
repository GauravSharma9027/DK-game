// import { SuperAdminModel } from "../models/SuperAdmin.model.js";
// import { ApiError, ApiResponse, asyncHandler } from "../utils/http.js";
// import jwtGenerate from "../utils/jwt.generate.utils.js";

// /** POST /api/super-admin/login */
// export const loginSuperAdmin = asyncHandler(async (req, res) => {
//     const { email, password } = req.body;
//     if (!email || !password) throw new ApiError(400, "Email & password required");
//     const admin = await SuperAdminModel.findOne({ email }).select("+password");
//     if (!admin) throw new ApiError(401, "Invalid credentials");
//     const valid = await admin.comparePassword(password);
//     if (!valid) throw new ApiError(401, "Invalid credentials");
//     admin.lastLoginAt = new Date();
//     await admin.save();
//     const payload = {
//         adminId: admin._id,
//         adminNumber: isGuesser.phone,
//     }
//     const token = jwtGenerate(payload);
//     res.cookie("accessToken", token, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === "production",
//         sameSite: "strict",
//     }).status(200).json(new ApiResponse(200, { admin }, "Login successful"));
// });

// /** GET /api/super-admin/me */
// export const getSuperAdminProfile = asyncHandler(async (req, res) => {
//     const admin = await SuperAdminModel.findById(req.admin._id);
//     if (!admin) throw new ApiError(404, "Super admin not found");
//     return res.status(200).json(new ApiResponse(200, admin));
// });

// /** PUT /api/super-admin/me */
// export const updateSuperAdminProfile = asyncHandler(async (req, res) => {
//     const { fullName, phone, avatar, password } = req.body;
//     const admin = await SuperAdminModel.findById(req.admin._id).select("+password");
//     if (!admin) throw new ApiError(404, "Super admin not found");
//     if (fullName) admin.fullName = fullName;
//     if (phone) admin.phone = phone;
//     if (avatar) admin.avatar = avatar;
//     if (password) admin.password = password; // will hash in pre-save
//     await admin.save();
//     return res.status(200).json(new ApiResponse(200, admin, "Profile updated"));
// });

// /** POST /api/super-admin/logout */
// export const logoutSuperAdmin = asyncHandler(async (_req, res) => {
//     res.clearCookie("accessToken").status(200).json(new ApiResponse(200, {}, "Logged out"));
// });
