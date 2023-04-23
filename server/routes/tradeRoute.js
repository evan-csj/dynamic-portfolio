const router = require('express').Router();
const tradeController = require('../controllers/tradeController');

router.route('/').post(tradeController.addTrade);

router.route('/user/:userId').get(tradeController.tradeHistory);

module.exports = router;
