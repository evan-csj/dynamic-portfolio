const router = require('express').Router();
const statController = require('../controllers/statController');

router.route('/profile').get(statController.getCompanyProfile);

module.exports = router;
