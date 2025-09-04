const jwt = require("jsonwebtoken")
const SuperAdminModel = require("../model/SuperAdmin.model.js");
const { ApiError } = require("../utils/hook.utils.js");

const verifySuperAdmin = async (req, res, next) => {
    try {
        const token =
            req.cookies?.accessToken ||
            (req.headers.authorization?.startsWith("Bearer ")
                ? req.headers.authorization.split(" ")[1]
                : null);
        if (!token) throw new ApiError(401, "Unauthorized");
        const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const admin = await SuperAdminModel.findById(payload.adminId);
        if (!admin) throw new ApiError(401, "Invalid token");
        req.admin = admin;
        next();
    } catch (err) {
        next(new ApiError(401, "Unauthorized", { cause: err.message }));
    }
};

module.exports = verifySuperAdmin;
