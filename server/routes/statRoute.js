const router = require('express').Router();
const statController = require('../controllers/statController');
const { isAuth } = require('../middlewares/authentication');

router.route('/profile').get(isAuth, statController.getCompanyProfile);
router.route('/eps').get(isAuth, statController.getEps);
router.route('/trends').get(isAuth, statController.getTrends);

module.exports = router;
