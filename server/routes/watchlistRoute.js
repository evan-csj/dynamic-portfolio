const router = require('express').Router();
const watchlistController = require('../controllers/watchlistController');
const { authorize } = require('../middlewares/authentication');

router.route('/user/:userId?').get(watchlistController.getWatchlist);
router
    .route('/')
    .post(watchlistController.addWatchItem)
    .put(watchlistController.deleteWatchItem);

module.exports = router;
