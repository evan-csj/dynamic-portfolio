const passport = require('passport');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const knex = require('knex')(require('../knexfile'));
const { CLIENT_URL, JWT_SECRET } = process.env;

const githubOAuth = passport.authenticate('github');
const googleOAuth = passport.authenticate('google');

const githubCallback = passport.authenticate('github', {
    failureRedirect: '/',
});
const googleCallback = passport.authenticate('google', {
    failureRedirect: '/',
});

const callbackRedirect = async (req, res) => {
    const { provider } = req.user;
    try {
        let keyField, keyValue;

        if (provider) {
            switch (provider) {
                case 'github':
                    keyField = 'github_username';
                    keyValue = req.user.username;
                    break;
                case 'google':
                    keyField = 'user_gmail';
                    keyValue = req.user.emails[0].value;
                    break;
                default:
                    return;
            }

            const userDB = await knex('user')
                .select('id', 'is_new', keyField)
                .where(keyField, keyValue)
                .first();

            const token = jwt.sign(
                {
                    id: userDB.id,
                },
                JWT_SECRET,
                { expiresIn: '1d' }
            );

            res.cookie('userId', userDB.id);
            res.cookie('JWT', token);

            if (!userDB.is_new) {
                return res.redirect(`${CLIENT_URL}/#/profile`);
            } else {
                return res.redirect(`${CLIENT_URL}/#/signup`);
            }
        } else {
            return res.redirect(`${CLIENT_URL}/#/login`);
        }
    } catch (error) {
        console.error('Error', error);
        return res.redirect(`${CLIENT_URL}/#/login`);
    }
};

module.exports = {
    githubOAuth,
    googleOAuth,
    githubCallback,
    googleCallback,
    callbackRedirect,
};
