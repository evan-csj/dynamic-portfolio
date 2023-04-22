const router = require('express').Router();
const tradeController = require('../controllers/tradeController');

router.route('/:userid').get(tradeController.tradeHistory);
// .post(tradeController.newTrade)
// .delete(tradeController.deleteTrade);

module.exports = router;
