const { default: mongoose } = require("mongoose");
const SuperAdminModel = require("../model/SuperAdmin.model.js");
const { ApiError, ApiResponse, asyncHandler } = require("../utils/hook.utils.js");
const jwtGenerate = require("../utils/jwt.generate.utils.js");


/** POST /api/super-admin/login */
const loginSuperAdmin = asyncHandler(async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!req.body) return res.status(404).json({ success: false, message: "req.body not found" });
        if (!email || !password) throw new ApiError(400, "Email & password required");
        const admin = await SuperAdminModel.findOne({ email }).select("+password")
        if (!admin) return res.status(404).json({ success: false, message: "Email Not Exist" });
        const valid = await admin.comparePassword(password);
        if (!valid) return res.status(404).json({ success: false, message: "Incorrect Password" });
        admin.lastLoginAt = new Date();
        await admin.save();
        const payload = {
            adminId: admin._id,
            adminNumber: admin.phone,
        }
        const token = jwtGenerate(payload);
        return res.cookie("accessToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production" ? true : false,
            sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax"
        }).status(200).json(new ApiResponse(200, { admin }, "Login successful"));
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

/** GET /api/super-admin/me */
const getSuperAdminProfile = asyncHandler(async (req, res) => {
    try {
        // const admin = await SuperAdminModel.findById(req.params.adminId);
        const admin = await SuperAdminModel.findOne();
        if (!admin) throw new ApiError(404, "Super admin not found");
        return res.status(200).json(new ApiResponse(200, admin, null));
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

/** PUT /api/super-admin/me */
const updateSuperAdminProfile = asyncHandler(async (req, res) => {
    try {
        const { fullName, phone, avatar, password } = req.body;
        const admin = await SuperAdminModel.findById(req.admin._id).select("+password");
        if (!admin) throw new ApiError(404, "Super admin not found");
        if (fullName) admin.fullName = fullName;
        if (phone) admin.phone = phone;
        if (avatar) admin.avatar = avatar;
        if (password) admin.password = password; // will hash in pre-save
        await admin.save();
        return res.status(200).json(new ApiResponse(200, admin, "Profile updated"));
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

// update User Name 
const updateSuperAdminName = asyncHandler(async (req, res) => {
    try {
        const { fullName } = req.body
        if (!fullName) return res.status(400).json(new ApiResponse(400, null, "Full name is required"));
        const admin = await SuperAdminModel.findById(req.admin._id);
        if (!admin) return forceSuperAdminLogout(req, res);
        admin.fullName = fullName;
        await admin.save();
        return res.status(200).json(new ApiResponse(200, admin, "Name updated successfully"));
    } catch (error) {
        console.error("Update Name Error:", error.message);
        return res.status(500).json(new ApiResponse(500, null, "Internal Server Error"));
    }
});

// update password
const updateSuperAdminPassword = asyncHandler(async (req, res) => {
    try {
        console.log(req.body);
        const { oldPassword, newPassword, confirmPassword } = req.body.body;
        console.log("oldPassword, newPassword, confirmPassword; ", oldPassword, newPassword, confirmPassword);
        if (!oldPassword || !newPassword || !confirmPassword) return res.status(400).json(new ApiResponse(400, null, "All fields are required"));
        if (newPassword !== confirmPassword) return res.status(400).json(new ApiResponse(400, null, "New password and confirm password do not match"));
        // const admin = await SuperAdminModel.findById(req.admin._id).select("+password");
        const admin = await SuperAdminModel.findById(req.body.id).select("+password");
        if (!admin) return forceSuperAdminLogout(req, res);
        const isMatch = await admin.comparePassword(oldPassword);
        if (!isMatch) return res.status(401).json(new ApiResponse(401, null, "Old password is incorrect"));
        admin.password = newPassword;
        await admin.save();
        return res.status(200).json(new ApiResponse(200, {}, "Password updated successfully"));
    } catch (error) {
        console.error("Password Update Error:", error.message);
        return res.status(500).json(new ApiResponse(500, null, "Internal Server Error"));
    }
});

/** POST /api/super-admin/logout */
const logoutSuperAdmin = asyncHandler(async (_req, res) => {
    try {
        res.clearCookie("accessToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax"
        });
        return res.status(200).json(new ApiResponse(200, {}, "Super Admin logged out successfully"));
    } catch (error) {
        console.error("Logout Error:", error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

const forceSuperAdminLogout = (req, res) => {
    try {
        res.clearCookie("accessToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax"
        });
        return res.status(401).json(
            new ApiResponse(401, {}, "Session expired. Please login again.")
        );
    } catch (error) {
        console.error("Logout Error:", error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// admin verify
const verifyAdmin = async (req, res) => {
    try {
        const admin = await SuperAdminModel.findById(req.admin._id).select("-password");
        if (!admin) {
            return res.status(400).json(
                new ApiResponse(400, "Please Login Again")
            );
        }
        return res.status(200).json(
            new ApiResponse(200, {}, null)
        );
    } catch (error) {
        console.error("Logout Error:", error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

module.exports = {
    loginSuperAdmin,
    getSuperAdminProfile,
    updateSuperAdminProfile,
    updateSuperAdminName,
    updateSuperAdminPassword,
    logoutSuperAdmin,
    forceSuperAdminLogout,
    verifyAdmin
}