const router = require('express').Router();
const watchlistController = require('../controllers/watchlistController');
const { isAuth } = require('../middlewares/authentication');

router.route('/user/:userId?').get(isAuth, watchlistController.getWatchlist);
router
    .route('/')
    .post(isAuth, watchlistController.addWatchItem)
    .put(isAuth, watchlistController.deleteWatchItem);

module.exports = router;
