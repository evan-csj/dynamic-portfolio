const router = require('express').Router();
const tradeController = require('../controllers/tradeController');
const { isAuth } = require('../middlewares/authentication');

router.route('/').post(isAuth, tradeController.addTrade);
router.route('/user/:userId?').get(isAuth, tradeController.getTradeHistory);

module.exports = router;
