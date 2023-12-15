const jwt = require('jsonwebtoken');
require('dotenv').config();

const isAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        if (!req.headers.jwt) {
            return res.status(401).json('No token found');
        }
        const authTokenArray = req.headers.jwt.split(' ');
        if (
            authTokenArray[0].toLowerCase() !== 'bearer' ||
            authTokenArray.length !== 2
        ) {
            return res.status(401).json('Invalid token');
        }
        jwt.verify(
            authTokenArray[1],
            process.env.JWT_SECRET,
            (err, decoded) => {
                if (err) {
                    return res.status(401).json('The token is expired or invalid');
                }
                req.jwtPayload = decoded;
                next();
            }
        );
    }
};

module.exports = { isAuth };
