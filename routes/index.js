const router = require('express').Router();
const userRouter = require('./users');
const cardsRouter = require('./cards');
const { createUser, login } = require('../controllers/users');
const auth = require('../middlewares/auth');

router.post('/signup', createUser);
router.post('/signin', login);
router.use('/users', auth, userRouter);
router.use('/cards', auth, cardsRouter);
module.exports = router;
