const router = require('express').Router();
const portfolioController = require('../controllers/portfolioController');
const { isAuth } = require('../middlewares/authentication');

router.route('/user/:userId?').put(isAuth, portfolioController.updatePortfolio);

module.exports = router;
