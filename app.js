const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const router = require('./routes');

const ConflictError = require('./errors/conflict-error');

mongoose.connect('mongodb://127.0.0.1/mestodb');

const app = express();
app.use(express.json());
app.use('/', router);
app.use(errors());
app.use((err, req, res, next) => {
  if (err.code === 11000) {
    throw new ConflictError('Пользователь с указанным email уже зарегистрирован');
  }
  if (err.statusCode === 400) {
    res.status(400).send({ message: 'Отправлены некорректные данные' });
  }
  if (!err.statusCode) {
    res.status(500).send({ message: 'Ошибка сервера' });
  }
  res.status(err.statusCode).send({ message: err.message });

  next();
});
app.listen(3000, () => {
});
