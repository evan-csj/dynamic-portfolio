const router = require('express').Router();
const websocketController = require('../controllers/websocketController');

router.route('/').get(websocketController.getRTPrice);

module.exports = router;
