const router = require('express').Router();
const userController = require('../controllers/userController');

router.route('/').post(userController.newUser);

router.route('/:username').get(userController.singleUser);
// .put(userController.editUser)
// .delete(userController.deleteUser);

module.exports = router;
