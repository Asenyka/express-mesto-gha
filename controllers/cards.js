const cardModel = require('../models/card');

const UNVALID_DATA_ERROR_CODE = 400;
const NOT_FOUND_ERROR_CODE = 404;
const GENERAL_ERROR_CODE = 500;
const OK = 200;
const NOT_FOUND_ERROR_MESSAGE = 'Запрашиваемая карточка не найдена';
const UNVALID_DATA_ERROR_MESSAGE = 'Переданы некорректные данные';
const GENERAL_ERROR_MESSAGE = 'Произошла ошибка';

const getCards = (req, res) => {
  cardModel.find({})
    .then((cards) => {
      res.status(OK).send(cards);
    })
    .catch((err) => {
      res.status(GENERAL_ERROR_CODE)
        .send({ message: GENERAL_ERROR_MESSAGE, err: err.message, stack: err.stack });
    });
};

const createCard = (req, res) => {
  const card = req.body;
  card.owner = req.user._id;
  cardModel.create(card)
    .then((newCard) => {
      res.status(201).send(newCard);
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
const deleteCard = (req, res) => {
  const { cardId } = req.params;
  if (!cardId.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(UNVALID_DATA_ERROR_CODE)
      .send({ message: UNVALID_DATA_ERROR_MESSAGE });
  }
  return cardModel.findByIdAndDelete(cardId)
    .then((card) => {
      if (card === null) {
        return res.status(NOT_FOUND_ERROR_CODE)
          .send({ message: NOT_FOUND_ERROR_MESSAGE });
      }
      return getCards(req, res);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(NOT_FOUND_ERROR_CODE)
          .send({ message: NOT_FOUND_ERROR_MESSAGE });
      } return res.status(GENERAL_ERROR_CODE)
        .send({ message: GENERAL_ERROR_MESSAGE, err: err.message, stack: err.stack });
    });
};

const likeCard = (req, res) => {
  const { cardId } = req.params;
  if (!cardId.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(UNVALID_DATA_ERROR_CODE)
      .send({ message: UNVALID_DATA_ERROR_MESSAGE });
  }
  return cardModel.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (card === null) {
        return res.status(NOT_FOUND_ERROR_CODE)
          .send({ message: NOT_FOUND_ERROR_MESSAGE });
      }
      return res.status(OK).send(card);
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

const dislikeCard = (req, res) => {
  const { cardId } = req.params;
  if (!cardId.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(UNVALID_DATA_ERROR_CODE)
      .send({ message: UNVALID_DATA_ERROR_MESSAGE });
  }
  return cardModel.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (card === null) {
        return res.status(NOT_FOUND_ERROR_CODE)
          .send({ message: NOT_FOUND_ERROR_MESSAGE });
      }
      return res.status(OK).send(card);
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
module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
