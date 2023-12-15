const router = require('express').Router();
const userController = require('../controllers/userController');
const { isAuth } = require('../middlewares/authentication');

router.route('/').post(userController.checkUser).put(isAuth, userController.editUser);
router.route('/:userId?').get(isAuth, userController.singleUser);

module.exports = router;
