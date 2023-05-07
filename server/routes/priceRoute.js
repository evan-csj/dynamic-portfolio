const router = require('express').Router();
const priceController = require('../controllers/priceController');

router.route('/realtime').get(priceController.getRTPriceAPI);
router.route('/history/:tickers').get(priceController.getPriceHistory);

module.exports = router;
