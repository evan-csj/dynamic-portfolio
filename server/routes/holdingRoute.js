const router = require('express').Router();
const holdingController = require('../controllers/holdingController');
const { isAuth } = require('../middlewares/authentication');

router.route('/user/:userId?').get(isAuth, holdingController.getHolding);

module.exports = router;
