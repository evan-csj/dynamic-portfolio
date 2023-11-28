const jwt = require('jsonwebtoken');
require('dotenv').config();

const isAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        console.log(req.headers.jwt)
        if (!req.headers.jwt) {
            return res.status(401).json('No token found');
            // return res.redirect(`${process.env.CLIENT_URL}/login`);
        }
        const authTokenArray = req.headers.jwt.split(' ');
        if (
            authTokenArray[0].toLowerCase() !== 'bearer' ||
            authTokenArray.length !== 2
        ) {
            return res.status(401).json('Invalid token');
            // return res.redirect(`${process.env.CLIENT_URL}/login`);
        }
        jwt.verify(
            authTokenArray[1],
            process.env.JWT_SECRET,
            (err, decoded) => {
                if (err) {
                    return res.status(401).json('The token is expired or invalid');
                    // return res.redirect(`${process.env.CLIENT_URL}/login`);
                }
                req.jwtPayload = decoded;
                next();
            }
        );
    }
};

module.exports = { isAuth };
