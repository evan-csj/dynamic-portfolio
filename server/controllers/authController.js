const passport = require('passport');
require('dotenv').config();

const githubOAuth = passport.authenticate('github');

const githubCallback = passport.authenticate('github', {
    failureRedirect: '/',
});

const callbackRedirect = (_req, res) => {
    return res.redirect(`${process.env.CLIENT_URL}/profile`);
};

// const callbackSuccess = (req, res) => {
//     if (req.user) {
//         return res.status(200).json(req.user);
//     } else {
//         return res.status(401).json({ message: 'User is not logged in' });
//     }
// };

module.exports = {
    githubOAuth,
    githubCallback,
    callbackRedirect,
    // callbackSuccess,
};
