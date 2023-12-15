const router = require('express').Router();
const symbolController = require('../controllers/symbolController');
const { isAuth } = require('../middlewares/authentication');

router.route('/').get(isAuth, symbolController.getSymbols);
router.route('/info').put(isAuth, symbolController.updateSymbolInfo);
router.route('/price').put(isAuth, symbolController.updateSymbolPrice);

module.exports = router;
