const express = require('express');
const mongoose = require('mongoose');
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

app.use((req, res, next) => {
  res.status(404).send({ message: 'Запрашиваемая страница не найдена' });
  next();
});
app.listen(3000, () => {
});
