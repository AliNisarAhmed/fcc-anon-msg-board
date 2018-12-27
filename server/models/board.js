const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema({
  board: {
    type: String,
    unique: true,
    required: true
  },
  threads: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'thread'}],
    default: []
  }
});

const Board = mongoose.model('board', boardSchema);

module.exports = Board;