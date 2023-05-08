const router = require('express').Router();
const watchlistController = require('../controllers/watchlistController');

router
    .route('user/:userId')
    .get(watchlistController.getWatchlist)
    .post(watchlistController.addWatchItem)
    .delete(watchlistController.deleteWatchItem);

module.exports = router;
