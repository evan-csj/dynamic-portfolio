const router = require('express').Router();
const symbolController = require('../controllers/symbolController');

router
    .route('/')
    .get(symbolController.getSymbols)
    .put(symbolController.updateSymbolInfo);

module.exports = router;
