const jwt = require('jsonwebtoken');

const jwtGenerate = (payload) => {
    try {
        return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "1h" })
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = jwtGenerate;