const router = require('express').Router();
const portfolioController = require('../controllers/portfolioController');

router.route('/user/:userId').get(portfolioController.getPortfolio);

module.exports = router;