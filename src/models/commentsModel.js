const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  text: {
    type: string,
    required: [true, 'Comentario vacio no admitido'],
  },
});

const Comment = mongoose.model('Comment', commentSchema);
