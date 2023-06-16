const router = require('express').Router();
const priceController = require('../controllers/priceController');

router.route('/forex').get(priceController.getForex);
router.route('/candles').get(priceController.getCandles);
router.route('/quote').get(priceController.getQuote);

module.exports = router;
