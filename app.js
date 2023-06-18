const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes');

mongoose.connect('mongodb://127.0.0.1/mestodb');

const app = express();
app.use((req, res, next) => {
  req.user = {
    _id: '6489fccfcfa43e82c7cca490',
  };

  next();
});
app.use((req, res, next) => {
  res.status(404).send({message:"Запрашиваемая страница не найдена"});
   next();
});
app.use(express.json());

app.use(router);
app.listen(3000, () => {
});
