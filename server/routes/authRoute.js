const router = require('express').Router();
const authController = require('../controllers/authController');

router.route('/github').get(authController.githubOAuth);
router
    .route('/github/callback')
    .get(authController.githubCallback, authController.callbackRedirect);


router.route('/google').get(authController.googleOAuth);
router
    .route('/google/callback')
    .get(authController.googleCallback, authController.callbackRedirect);

router.route('/success-callback').get(authController.callbackSuccess);

module.exports = router;