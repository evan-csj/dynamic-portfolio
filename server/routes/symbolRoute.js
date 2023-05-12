const router = require('express').Router();
const symbolController = require('../controllers/symbolController');

router.route('/:symbol').get(symbolController.getSymbol);

module.exports = router;
