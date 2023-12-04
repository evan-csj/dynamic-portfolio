const router = require('express').Router();
const holdingController = require('../controllers/holdingController');

router.route('/user/:userId?').get(holdingController.getHolding);

module.exports = router;
