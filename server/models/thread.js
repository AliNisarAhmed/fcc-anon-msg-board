const mongoose = require('mongoose');

const threadSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    minlength: 1
  },
  delete_password: {
    type: String,
    required: true,
    minlength: 1
  },
  created_on: {
    type: Date,
    default: Date.now()
  },
  bumped_on: {
    type: Date,
    default: Date.now()
  },
  reported: {
    type: Boolean,
    default: false
  },
  replies: {
    type: [{type: mongoose.Schema.Types.ObjectId, ref: 'reply'}],
    default: []
  }
});

const Thread = mongoose.model('thread', threadSchema);

module.exports = Thread;