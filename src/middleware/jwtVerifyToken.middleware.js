// const jwt = require('jsonwebtoken');
// const jwtAuthVerifyMiddleware = async (req, res, next) => {
//     try {
//         const token = req.cookies.token;
//         if (!token || token === undefined || typeof token !== 'string') {
//             return res.status(401).json({
//                 success: false,
//                 message: "please Login again"
//             });
//         }
//         jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
//             if (err) {
//                 res.clearCookie('token', {
//                     httpOnly: true,
//                     secure: process.env.NODE_ENV === "development",
//                     sameSite: "Strict",
//                     maxAge: 0
//                 });
//                 console.log(err);
//                 return res.status(401).json({ success: false, message: "Please login again" });
//             }
//             req.verifyGuesser = decoded;
//             next();
//         });
//     } catch (error) {
//         return res.status(403).json({
//             error: "Invalid or expired token",
//             success: false,
//         })
//     }
// }

// module.exports = {
//     jwtAuthVerifyMiddleware,
// }

const jwt = require("jsonwebtoken");

const jwtAuthVerifyMiddleware = async (req, res, next) => {
    try {
        // Get token from headers instead of cookies
        const authHeader = req.headers["authorization"];

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "No token provided. Please login again.",
            });
        }

        const token = authHeader.split(" ")[1]; // "Bearer <token>"

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Invalid token format. Please login again.",
            });
        }

        // Verify token
        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    success: false,
                    message: "Token expired or invalid. Please login again.",
                });
            }
            req.verifyGuesser = decoded; // decoded user info (id, etc.)
            next();
        });
    } catch (error) {
        return res.status(403).json({
            success: false,
            message: "Authentication failed.",
            error: error.message,
        });
    }
};

module.exports = {
    jwtAuthVerifyMiddleware,
};
