const router = require('express').Router();
const holdingController = require('../controllers/holdingController');

router.route('/user/:userId').get(holdingController.getHolding);
router.route('/user/:userId/totalvalue').get(holdingController.getTotalValue);

module.exports = router;
