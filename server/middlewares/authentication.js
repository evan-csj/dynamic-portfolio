const jwt = require('jsonwebtoken');
const dayjs = require('dayjs');
require('dotenv').config();
const knex = require('knex')(require('../knexfile'));
const { JWT_SECRET } = process.env;

const isAuth = async (req, res, next) => {
    let oauthByPass;
    let isExpire = false;
    try {
        const { provider, username, emails } = req.session.passport.user;
        isExpire = dayjs().isBefore(dayjs(req.session.cookie._expires));
        if (provider === 'github') {
            oauthByPass = await knex('oauth-backup')
                .where({
                    provider: provider,
                    provider_id: username,
                })
                .first();
        }
        if (provider === 'google') {
            oauthByPass = await knex('oauth-backup')
                .where({
                    provider: provider,
                    provider_id: emails[0].value,
                })
                .first();
        }
    } catch (error) {}

    if (req.isAuthenticated()) {
        next();
    } else if (oauthByPass && isExpire) {
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
        jwt.verify(authTokenArray[1], JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json('The token is expired or invalid');
            }
            req.jwtPayload = decoded;
            next();
        });
    }
};

module.exports = { isAuth };
