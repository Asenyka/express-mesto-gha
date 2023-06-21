const router = require('express').Router();
const {
  getUserById, getUsers, updateUser, updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:user_id', getUserById);

router.patch('/me', updateUser);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
