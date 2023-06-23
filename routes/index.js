const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const userRouter = require('./users');
const cardsRouter = require('./cards');
const { createUser, login } = require('../controllers/users');
const auth = require('../middlewares/auth');

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/https?:\/\/(www\.)?[-a-z0-9-._~:/?#@!$&'()*+,;=_]#?/),
    email: Joi.string().required().pattern(/^[a-z-Z0-9._%+-]+@[a-z-Z0-9-]+.+.[a-z]{2,4}$/i),
    password: Joi.string().required().min(4),
  }),
}), createUser);
router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().pattern(/^[a-z-Z0-9._%+-]+@[a-z-Z0-9-]+.+.[a-z]{2,4}$/i),
    password: Joi.string().required().min(4),
  }),
}), login);
router.use('/users', auth, userRouter);
router.use('/cards', auth, cardsRouter);
module.exports = router;
