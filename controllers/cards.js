const cardModel = require('../models/card');
const NotFoundError = require('../errors/not-found-error');
const AuthorizationError = require('../errors/auth-error');

const OK = 200;

const getCards = (req, res, next) => {
  cardModel.find({})
    .then((cards) => {
      res.status(OK).send(cards);
    })
    .catch(next);
};

const createCard = (req, res, next) => {
  const card = req.body;
  card.owner = req.user._id;
  cardModel.create(card)
    .then((newCard) => {
      res.status(OK).send(newCard);
    })
    .catch(next);
};
const deleteCard = (req, res, next) => {
  const userId = req.user._id;
  const { cardId } = req.params;
  return cardModel.findByIdAndDelete(cardId)
    .then((card) => {
      if (card === null) {
        throw new NotFoundError('Запрашиваемая карточка не найдена');
      }
      if (!card.owner.equals(userId)) {
        throw new AuthorizationError('Можно удалить только созданные Вами карточки');
      }
      return getCards(req, res);
    })
    .catch(next);
};

const likeCard = (req, res, next) => cardModel.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
  { new: true },
)
  .then((card) => {
    if (card === null) {
      throw new NotFoundError('Запрашиваемая карточка не найдена');
    }
    return res.status(OK).send(card);
  })
  .catch(next);

const dislikeCard = (req, res, next) => cardModel.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true },
)
  .then((card) => {
    if (card === null) {
      throw new NotFoundError('Запрашиваемая карточка не найдена');
    }
    return res.status(OK).send(card);
  })
  .catch(next);
module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
