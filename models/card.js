
const mongoose = require('mongoose');

const cardSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,

  },
  link: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.ObjectId,
    required: true,
  },
  likes: {
    type: [mongoose.ObjectId],
    default: [],
  },
  careatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);