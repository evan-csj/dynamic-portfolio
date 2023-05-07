const router = require('express').Router();
const holdingController = require('../controllers/holdingController');

router.route('/user/:userId').get(holdingController.getHolding);
router.route('/user/:userId/rtprice').get(holdingController.getHoldingRTPrice);

module.exports = router;
