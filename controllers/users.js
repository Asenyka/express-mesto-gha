const userModel = require('../models/user');
const UNVALID_DATA_ERROR_CODE  = 400;
const NOT_FOUND_ERROR_CODE = 404;
const GENERAL_ERROR_CODE = 500;
const NOT_FOUND_ERROR_MESSAGE = 'Запрашиваемый пользователь не найден';
const UNVALID_DATA_ERROR_MESSAGE = 'Переданы некорректные данные';
const GENERAL_ERROR_MESSAGE = 'Произошла ошибка';

const getUserById = (req, res) => {
  userModel.findById(req.params.user_id)
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {return res.status(NOT_FOUND_ERROR_CODE).send({message: NOT_FOUND_ERROR_MESSAGE})}
      else{return res.status(GENERAL_ERROR_CODE).send({message: GENERAL_ERROR_MESSAGE, err: err.message, stack: err.stack})}
    })

};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  userModel.findByIdAndUpdate(req.params.user_id, { name, about }, { new: true })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') return res.status(NOT_FOUND_ERROR_CODE).send({message: NOT_FOUND_ERROR_MESSAGE});
      if (err.name === 'ValidationError') return res.status(UNVALID_DATA_ERROR_CODE).send({message: UNVALID_DATA_ERROR_MESSAGE});
      if (err.name !== 'ValidationError' && err.name !== 'CastError') return res.status(GENERAL_ERROR_CODE).send({message: GENERAL_ERROR_MESSAGE, err: err.message, stack: err.stack})
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body.avatar;
  userModel.findByIdAndUpdate(req.params.user_id, avatar)
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') return res.status(NOT_FOUND_ERROR_CODE).send({message: NOT_FOUND_ERROR_MESSAGE});
      if (err.name === 'ValidationError') return res.status(UNVALID_DATA_ERROR_CODE).send({message: UNVALID_DATA_ERROR_MESSAGE});
      if (err.name !== 'ValidationError' && err.name !== 'CastError') return res.status(GENERAL_ERROR_CODE).send({message: GENERAL_ERROR_MESSAGE, err: err.message, stack: err.stack})
    });
};

const getUsers = (req, res) => {
  userModel.find({})
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {return res.status(UNVALID_DATA_ERROR_CODE).send({message: UNVALID_DATA_ERROR_MESSAGE})}
      else{return res.status(GENERAL_ERROR_CODE).send({message: GENERAL_ERROR_MESSAGE, err: err.message, stack: err.stack})}
    });
};

const createUser = (req, res) => {
  userModel.create(req.body)
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {return res.status(UNVALID_DATA_ERROR_CODE).send({message: UNVALID_DATA_ERROR_MESSAGE})}
      else{return res.status(GENERAL_ERROR_CODE).send({message: GENERAL_ERROR_MESSAGE, err: err.message, stack: err.stack})}
    });
};
module.exports = {
  getUserById,
  getUsers,
  createUser,
  updateUser,
  updateAvatar,
};
