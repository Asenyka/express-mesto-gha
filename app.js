const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const router = require('./routes');
const NotFoundError = require('./errors/not-found-error');

mongoose.connect('mongodb://127.0.0.1/mestodb');

const app = express();
app.use(express.json());
app.use('/', router);
app.use(() => {
  throw new NotFoundError('Запрашиваемая страница не найдена');
});
app.use(errors());
app.use((err, req, res, next) => {
  if (err.code === 11000) {
    res.status(409).send({ message: 'Пользователь с указанным email уже зарегистрирован' });
  }
  if (!err.statusCode) {
    res.status(500).send({ message: 'Ошибка сервера' });
  }
  res.status(err.statusCode).send({ message: err.message });

  next();
});
app.listen(3000, () => {
});
