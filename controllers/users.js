const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user');

const UNVALID_DATA_ERROR_CODE = 400;
const NOT_FOUND_ERROR_CODE = 404;
const GENERAL_ERROR_CODE = 500;
const OK = 200;
const NOT_FOUND_ERROR_MESSAGE = 'Запрашиваемый пользователь не найден';
const UNVALID_DATA_ERROR_MESSAGE = 'Переданы некорректные данные';
const GENERAL_ERROR_MESSAGE = 'Произошла ошибка';

const getUserById = (req, res) => {
  const userId = req.params.user_id;
  if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(UNVALID_DATA_ERROR_CODE)
      .send({ message: UNVALID_DATA_ERROR_MESSAGE });
  }
  return userModel.findById(userId)
    .then((user) => {
      if (user === null) {
        return res.status(NOT_FOUND_ERROR_CODE)
          .send({ message: NOT_FOUND_ERROR_MESSAGE });
      }
      return res.status(OK).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(NOT_FOUND_ERROR_CODE)
          .send({ message: NOT_FOUND_ERROR_MESSAGE });
      }
      if (err.name === 'ValidationError') {
        return res.status(UNVALID_DATA_ERROR_CODE)
          .send({ message: UNVALID_DATA_ERROR_MESSAGE });
      }
      return res.status(GENERAL_ERROR_CODE)
        .send({ message: GENERAL_ERROR_MESSAGE, err: err.message, stack: err.stack });
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  userModel.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (user === null) {
        return res.status(NOT_FOUND_ERROR_CODE)
          .send({ message: NOT_FOUND_ERROR_MESSAGE });
      }
      return res.status(OK).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(NOT_FOUND_ERROR_CODE)
          .send({ message: NOT_FOUND_ERROR_MESSAGE });
      }
      if (err.name === 'ValidationError') {
        return res.status(UNVALID_DATA_ERROR_CODE)
          .send({ message: UNVALID_DATA_ERROR_MESSAGE });
      }
      return res.status(GENERAL_ERROR_CODE)
        .send({ message: GENERAL_ERROR_MESSAGE, err: err.message, stack: err.stack });
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  userModel.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (user === null) {
        res.status(UNVALID_DATA_ERROR_CODE)
          .send({ message: UNVALID_DATA_ERROR_MESSAGE });
      } else { res.status(200).send(user); }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(NOT_FOUND_ERROR_CODE)
          .send({ message: NOT_FOUND_ERROR_MESSAGE });
      }
      if (err.name === 'ValidationError') {
        return res.status(UNVALID_DATA_ERROR_CODE)
          .send({ message: UNVALID_DATA_ERROR_MESSAGE });
      }
      return res.status(GENERAL_ERROR_CODE)
        .send({ message: GENERAL_ERROR_MESSAGE, err: err.message, stack: err.stack });
    });
};

const getUsers = (req, res) => {
  userModel.find({})
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(UNVALID_DATA_ERROR_CODE)
          .send({ message: UNVALID_DATA_ERROR_MESSAGE });
      }
      return res.status(GENERAL_ERROR_CODE)
        .send({ message: GENERAL_ERROR_MESSAGE, err: err.message, stack: err.stack });
    });
};

const createUser = (req, res) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => userModel.create({
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
      email: req.body.email,
      password: hash,
    }))

    .then((user) => {
      res.status(OK).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(UNVALID_DATA_ERROR_CODE)
          .send({ message: UNVALID_DATA_ERROR_MESSAGE });
      }
      return res.status(GENERAL_ERROR_CODE)
        .send({ message: GENERAL_ERROR_MESSAGE, err: err.message, stack: err.stack });
    });
};
const login = (req, res) => {
  const { email, password } = req.body;
  userModel.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'key', { expiresIn: '7d' });
      // res.cookie('jwt', token, {
      // maxAge: 604800000,
      //  httpOnly: true,}).end();

      res.send({ token });
    })
    .catch((err) => {
      res
        .status(401)
        .send({ message: err.message });
    });
};
module.exports = {
  getUserById,
  getUsers,
  createUser,
  updateUser,
  updateAvatar,
  login,
};
