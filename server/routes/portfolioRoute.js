const router = require('express').Router();
const portfolioController = require('../controllers/portfolioController');

router
    .route('/user/:userId')
    .put(portfolioController.updatePortfolio);

module.exports = router;
