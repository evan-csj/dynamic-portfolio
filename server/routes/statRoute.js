const router = require('express').Router();
const statController = require('../controllers/statController');

router.route('/profile').get(statController.getCompanyProfile);
router.route('/eps').get(statController.getEps);
router.route('/trends').get(statController.getTrends);

module.exports = router;
