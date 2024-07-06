const router = require('express').Router();
const symbolController = require('../controllers/symbolController');
const { isAuth } = require('../middlewares/authentication');

router.route('/').get(isAuth, symbolController.getSymbols);
router.route('/:ticker?').get(isAuth, symbolController.getSymbol);
router.route('/info').put(isAuth, symbolController.updateSymbolInfo);
router.route('/price').put(isAuth, symbolController.updateSymbolPrice);
router.route('/eps/:ticker?').put(isAuth, symbolController.updateSymbolEps);
router.route('/trend/:ticker?').put(isAuth, symbolController.updateSymbolTrend);

module.exports = router;
