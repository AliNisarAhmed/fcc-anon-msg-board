const Thread = require('./thread');
const Reply = require('./reply');
const Board = require('./board');

function createThread(text, delete_password) {
  return Thread.create({
    text,
    delete_password
  })
}

function updateBoardWithThread(boardName, threadId) {
  return Board.findOneAndUpdate({board: boardName}, {$push: {threads: threadId} }, {new: true}).exec();
}

async function findOrCreateBoard(boardName) {
  let foundBoard = await Board.findOne({board: boardName}).exec();
  if (!foundBoard) {
    foundBoard = await Board.create({
      board: boardName
    });
  }
  return foundBoard;
}

function createReply(text, delete_password) {
  return Reply.create({
    text,
    delete_password
  });
}

function updateThreadWithReply(threadId, replyId) {
  return Thread.findByIdAndUpdate(threadId, {$push: {replies: replyId} }, {new: true}).exec();
}

function reportThread(threadId) {
  return Thread.findByIdAndUpdate(threadId, { reported: true }, {new: true}).exec();
}

function reportReply(replyId) {
  return Reply.findByIdAndUpdate(replyId, { reported: true}, {new: true}).exec();
}

module.exports = {
  createThread,
  updateBoardWithThread,
  findOrCreateBoard,
  createReply,
  updateThreadWithReply,
  reportThread,
  reportReply,
}