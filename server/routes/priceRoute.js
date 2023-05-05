const router = require('express').Router();
const priceController = require('../controllers/priceController');

router.route('/:ticker').get(priceController.getPrice);

module.exports = router;
