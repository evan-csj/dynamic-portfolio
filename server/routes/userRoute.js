const router = require('express').Router();
const userController = require('../controllers/userController');
const { authorize, isAuth } = require('../middlewares/authorize');

router.route('/').put(userController.checkUser).post(userController.addUser);

router.route('/:username').get(userController.singleUser);
// .put(userController.editUser)
// .delete(userController.deleteUser);

module.exports = router;
