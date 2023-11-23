const router = require('express').Router();
// const passport = require('passport');
// require('dotenv').config();
const authController = require('../controllers/authController');

router.route('/github').get(authController.githubOAuth);
router
    .route('/github/callback')
    .get(authController.githubCallback, authController.callbackRedirect);
router.route('/success-callback').get(authController.callbackSuccess);

// router.get('/google', passport.authenticate('google'));
// router.get(
//     '/google/callback',
//     passport.authenticate('google', {
//         failureRedirect: `${process.env.CLIENT_URL}/auth-fail`,
//     }),
//     (_req, res) => {
//         res.redirect(`${process.env.CLIENT_URL}/auth/success-callback`);
//     }
// );

// router.get('/profile', (req, res) => {
//     if (req.user === undefined)
//         return res.status(401).json({ message: 'Unauthorized' });
//     res.status(200).json(req.user);
// });

// router.get('/logout', (req, res) => {
//     req.logout(error => {
//         if (error) {
//             return res.status(500).json({
//                 message: 'Server error, please try again later',
//                 error: error,
//             });
//         }
//         res.redirect(process.env.CLIENT_URL);
//     });
// });

module.exports = router;
