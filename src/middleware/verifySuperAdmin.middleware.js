// // middleware/verifySuperAdmin.js
// import jwt from "jsonwebtoken";
// import { SuperAdminModel } from "../models/SuperAdmin.model.js";
// import { ApiError } from "../utils/http.js";

// export const verifySuperAdmin = async (req, _res, next) => {
//     try {
//         const token =
//             req.cookies?.accessToken ||
//             (req.headers.authorization?.startsWith("Bearer ")
//                 ? req.headers.authorization.split(" ")[1]
//                 : null);
//         if (!token) throw new ApiError(401, "Unauthorized");
//         const payload = jwt.verify(token, process.env.JWT_SECRET);
//         const admin = await SuperAdminModel.findById(payload.sub);
//         if (!admin) throw new ApiError(401, "Invalid token");
//         req.admin = admin;
//         next();
//     } catch (err) {
//         next(new ApiError(401, "Unauthorized", { cause: err.message }));
//     }
// };
