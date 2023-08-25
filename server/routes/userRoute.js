const router = require('express').Router();
const userController = require('../controllers/userController');
const { authorize } = require('../middlewares/authorize');

router.route('/').put(userController.checkUser).post(userController.addUser);

router.route('/:username').get(authorize, userController.singleUser);
// .put(userController.editUser)
// .delete(userController.deleteUser);

module.exports = router;
