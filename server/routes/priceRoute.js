const router = require('express').Router();
const priceController = require('../controllers/priceController');

router.route('/realtime/:ticker').get(priceController.getRTPriceAPI);
router.route('/forex').get(priceController.getForex);
router.route('/history/:ticker').get(priceController.getPriceHistory);

module.exports = router;
