const jwt = require('jsonwebtoken');

const authorize = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).json('No token found');
    }
    const authTokenArray = req.headers.authorization.split(' ');
    if (
        authTokenArray[0].toLowerCase() !== 'bearer' &&
        authTokenArray.lenth !== 2
    ) {
        return res.status(401).json('Invalid token');
    }
    jwt.verify(authTokenArray[1], process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json('The token is expired or invalid');
        }
        req.jwtPayload = decoded;
        next();
    });
};

const isAuth = (req, res, next) => {
    console.log('isAuth', req.isAuthenticated());
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/login');
    }
};

module.exports = { authorize, isAuth };
