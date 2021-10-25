const Comment = require('../models/commentModel');
const wrapAsync = require('../utils/wrapAsync');
const { sendMsg } = require('./wspController');

// Not required
// exports.getAll = wrapAsync(async (req, res) => {
//   let comments = await req.RepairRequest.populate('comments');
//   comments = comments.comments;

//   res.status(200).json({
//     status: 'success',
//     comments,
//   });
// });

exports.createNew = wrapAsync(async (req, res) => {
  const newComment = await Comment.create({
    text: req.body.text,
  });

  req.repairRequest.comments.push(newComment._id);
  req.repairRequest.save();

  if (req.body.text.split(' ')[0] === ':enviar:') {
    sendMsg(req);
  }

  res.status(200).json({
    status: 'success',
    newComment,
  });
});
