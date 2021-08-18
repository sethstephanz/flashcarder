const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
  front: {
    type: String,
    required: true,
  },
  back: {
    type: String,
    required: true,
  },
  card_set: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
    lowercase: true,
  },
  userId: {
    type: String,
    required: true,
  },
});

const Card = mongoose.model("Card", cardSchema);

module.exports = Card;

// {
//     "front": "l'homme",
//     "back": "the man",
//     "user_id": 1,
//     "card_set": "french",
//     "tags": ['french', 'language']
// },
