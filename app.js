const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const router = require('./routes');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');

mongoose.connect('mongodb://127.0.0.1/mestodb');

const app = express();
app.use(express.json());
app.post('/signup', createUser);
app.post('/signin', login);
app.use('/users', auth, router);
app.use('/cards', auth, router);
app.use(errors());
app.use((err, req, res, next) => {
  if (!err.statusCode) {
    res.status(500).send({ message: 'Ошибка сервера' });
  }
  if (err.statusCode === 400) {
    res.status(400).send({ message: 'Отправлены некорректные данные' });
  }
  res.status(err.statusCode).send({ message: err.message });

  next();
});
app.listen(3000, () => {
});
