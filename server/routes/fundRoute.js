const router = require('express').Router();
const fundController = require('../controllers/fundController');
const { isAuth } = require('../middlewares/authentication');

router.route('/').post(isAuth, fundController.changeFund);
router.route('/user/:userId?').get(isAuth, fundController.getFundHistory);

module.exports = router;
