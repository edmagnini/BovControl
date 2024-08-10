const jwt = require("jsonwebtoken");

class Authenticator {
    generateToken(payload) {
        return jwt.sign(
            payload,
            process.env.JWT_KEY,
            {
                expiresIn: process.env.JWT_EXPIRES_IN
            }
        );
    }

    getTokenData(token) {
        return jwt.verify(
            token,
            process.env.JWT_KEY
        );
    }
}

module.exports = Authenticator;
