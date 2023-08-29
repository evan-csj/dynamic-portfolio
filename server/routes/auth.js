const router = require('express').Router();
const passport = require('passport');
require('dotenv').config();

router.get('/google', passport.authenticate('google'));
router.get(
    '/google/callback',
    passport.authenticate('google', {
        failureRedirect: `${process.env.CLIENT_URL}`,
    }),
    (_req, res) => {
        res.redirect(process.env.CLIENT_URL);
    }
);

router.get('/profile', (req, res) => {
    if (req.user === undefined)
        return res.status(401).json({ message: 'Unauthorized' });
    res.status(200).json(req.user);
});

router.get('/logout', (req, res) => {
    req.logout(error => {
        if (error) {
            return res.status(500).json({
                message: 'Server error, please try again later',
                error: error,
            });
        }
        res.redirect(process.env.CLIENT_URL);
    });
});

router.get('/success-callback', (req, res) => {
    if (req.user) {
        res.status(200).json(req.user);
    } else {
        res.status(401).json({ message: 'User is not logged in' });
    }
});

module.exports = router;
