const router = require('express').Router();
const userController = require('../controllers/userController');
const { isAuth } = require('../middlewares/authentication');

router.route('/').put(userController.checkUser).post(userController.addUser);
router.route('/:userId?').get(isAuth, userController.singleUser);
// .put(userController.editUser)

module.exports = router;
