const router = require('express').Router();
const symbolController = require('../controllers/symbolController');

router.route('/').get(symbolController.getSymbols);
router.route('/info').put(symbolController.updateSymbolInfo);
router.route('/price').put(symbolController.updateSymbolPrice);

module.exports = router;
