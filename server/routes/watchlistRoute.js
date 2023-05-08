const router = require('express').Router();
const watchlistController = require('../controllers/watchlistController');

router.route('/user/:userId').get(watchlistController.getWatchlist);
router.route('/').post(watchlistController.addWatchItem);
router.route('/:id').delete(watchlistController.deleteWatchItem);

module.exports = router;
