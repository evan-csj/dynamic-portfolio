const router = require('express').Router();
const watchlistController = require('../controllers/watchlistController');
const { authorize } = require('../middlewares/authorize');

router.route('/user/:userId').get(authorize, watchlistController.getWatchlist);
router.route('/').post(watchlistController.addWatchItem);
router.route('/:id').delete(watchlistController.deleteWatchItem);

module.exports = router;
