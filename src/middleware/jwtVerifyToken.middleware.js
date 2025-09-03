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
