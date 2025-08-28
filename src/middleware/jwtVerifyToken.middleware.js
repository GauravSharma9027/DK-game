const jwt = require('jsonwebtoken');
const jwtAuthVerifyMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token || token === undefined || typeof token !== 'string') {
            return res.status(401).json({
                success: false,
                message: "please Login again"
            });
        }
        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
            if (err) {
                res.clearCookie('token', {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "development",
                    sameSite: "Strict",
                    maxAge: 0
                });
                console.log(err);
                return res.status(401).json({ success: false, message: "Please login again" });
            }
            req.verifyGuesser = decoded;
            next();
        });
    } catch (error) {
        return res.status(403).json({
            error: "Invalid or expired token",
            success: false,
        })
    }
}

module.exports = {
    jwtAuthVerifyMiddleware,
}