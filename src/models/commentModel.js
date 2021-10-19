const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Respuestas vacias no admitidas'],
  },
});

module.exports = mongoose.model('Comment', commentSchema);
