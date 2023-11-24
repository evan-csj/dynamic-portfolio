const router = require('express').Router();
const authController = require('../controllers/authController');

router.route('/github').get(authController.githubOAuth);
router
    .route('/github/callback')
    .get(authController.githubCallback, authController.callbackRedirect);
// router.route('/success-callback').get(authController.callbackSuccess);

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

module.exports = router;
