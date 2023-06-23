const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user');
const NotFoundError = require('../errors/not-found-error');
const InvalidDataError = require('../errors/invalid-data-error');

const OK = 200;

const getUserById = (req, res, next) => {
  const { userId } = req.params;
  if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
    throw new InvalidDataError('Передан некорректный id пользователя');
  }
  return userModel.findById(userId)
    .then((user) => {
      if (user === null) {
        throw new NotFoundError('Пользователь с запрашиваемым id не найден');
      }
      return res.status(OK).send(user);
    })
    .catch(next);
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  userModel.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (user === null) {
        throw new NotFoundError('Пользователь с запрашиваемым id не найден');
      }
      return res.status(OK).send(user);
    })
    .catch(next);
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  userModel.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (user === null) {
        throw new InvalidDataError('Передан некорректный id пользователя');
      } else { res.status(200).send(user); }
    })
    .catch(next);
};

const getUsers = (req, res, next) => {
  userModel.find({})
    .then((users) => {
      res.send(users);
    })
    .catch(next);
};
const getCurrentUser = (req, res, next) => {
  userModel.findById(req.user._id)
    .then((user) => res.status(OK).send({ user }))
    .catch(next);
};

const createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => userModel.create({
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
      email: req.body.email,
      password: hash,
    }))

    .then((user) => {
      res.status(OK).send({
        name: user.name, about: user.about, _id: user._id, avatar: user.avatar, email: user.email,
      });
    })
    .catch(next);
};
const login = (req, res, next) => {
  const { email, password } = req.body;
  userModel.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'secret key');
      // res.cookie('jwt', token, {
      // maxAge: 604800000,
      //  httpOnly: true,}).end();

      res.send({ token });
    })
    .catch(next);
};
module.exports = {
  getUserById,
  getUsers,
  createUser,
  updateUser,
  updateAvatar,
  login,
  getCurrentUser,
};
