const router = require('express').Router();
const priceController = require('../controllers/priceController');
const { isAuth } = require('../middlewares/authentication');

router.route('/forex').get(isAuth, priceController.getForex);
router.route('/candles').get(isAuth, priceController.getCandles);
router.route('/quote').get(isAuth, priceController.getQuote);

module.exports = router;
