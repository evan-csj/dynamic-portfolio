const router = require('express').Router();
const fundController = require('../controllers/fundController');

router.route('/').post(fundController.changeFund);
router.route('/user/:userId').get(fundController.getFundHistory);

module.exports = router;
