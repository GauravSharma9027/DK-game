const jwt = require("jsonwebtoken");


const jwtAuthVerifyMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];
        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "No token provided. Please login again.",
            });
        }
        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Invalid token format. Please login again.",
            });
        }

        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    success: false,
                    message: "Token expired or invalid. Please login again.",
                });
            }
            req.verifyGuesser = decoded;
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


// const jwt = require("jsonwebtoken");
// const { ApiError } = require("../utils/http.js"); // custom error class (industry-level)

// const jwtAuthVerifyMiddleware = async (req, res, next) => {
//     try {
//         let token;
//         if (req.cookies && req.cookies.token) {
//             token = req.cookies.token;
//         }
//         if (!token && req.headers["authorization"]) {
//             const authHeader = req.headers["authorization"];
//             if (authHeader && authHeader.startsWith("Bearer ")) {
//                 token = authHeader.split(" ")[1];
//             }
//         }
//         if (!token) {
//             throw new ApiError(401, "No token provided. Please login again.");
//         }
//         const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
//         req.verifyGuesser = decoded;
//         next();
//     } catch (error) {
//         if (error.name === "TokenExpiredError") {
//             return next(new ApiError(401, "Token expired. Please login again."));
//         }
//         if (error.name === "JsonWebTokenError") {
//             return next(new ApiError(401, "Invalid token. Please login again."));
//         }
//         return next(new ApiError(403, "Authentication failed.", error.message));
//     }
// };

// module.exports = {
//     jwtAuthVerifyMiddleware,
// };
