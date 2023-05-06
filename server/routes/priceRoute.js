const router = require('express').Router();
const priceController = require('../controllers/priceController');

router.route('/current/:ticker').get(priceController.getPriceCurrent);
router.route('/history/:ticker').get(priceController.getPriceHistory);

module.exports = router;
