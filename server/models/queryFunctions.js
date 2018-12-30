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
  return Thread.findByIdAndUpdate(threadId, {$push: {replies: replyId}, bumped_on: Date.now() }, {new: true}).exec();
}

function reportThread(threadId) {
  return Thread.findByIdAndUpdate(threadId, { reported: true }, {new: true}).exec();
}

function reportReply(replyId) {
  return Reply.findByIdAndUpdate(replyId, { reported: true}, {new: true}).exec();
}

async function deleteThread(threadId, deletePassword) {
  const thread = await Thread.findOne({_id: threadId});
  if (thread.delete_password === deletePassword) {
    return await thread.remove();
  } else {
    return null;
  }
}

function removeThreadFromBoard(boardName, threadId) {
  return Board.findOneAndUpdate({ board: boardName }, { $pull: { threads: threadId } }, {new: true}).exec(); 
}

async function deleteReply(replyId, deletePassword) {
  const reply = await Reply.findOne({ _id: replyId });
  if (reply.delete_password === deletePassword) {
    return await reply.remove();
  } else {
    return null;
  }
}

function removeReplyFromThread(threadId, replyId) {
  return Thread.findByIdAndUpdate(threadId, { $pull: { replies: replyId } }, {new: true}).exec();
}

async function getThreads(boardName) {
  let board = await Board.findOne({board: boardName}).populate({
    path: 'threads',
    options: {
      sort: { _id: -1 },  // the first four digits of the Mongoose ID are timestamps, hence we can sort by ID (sorting by date is not working, )
      limit: 10
    },
    populate: {
      path: 'replies',
      select: ["text", "created_on"],
      options: {
        sort: { _id: -1 },
      }
    }
  }).exec();
  return board.threads;
}

function getThreadWithAllReplies(threadId) {
  return Thread.findById(threadId).populate({
    path: 'replies',
    select: ['text', 'created_on'],
    options: {
      sort: { _id: -1 },
    }
  });
}

function getAllBoards() {
  return Board.find({}).sort({_id: -1}).exec();
}

function findBoard(boardName) {
  return Board.findOne({board: boardName}).exec();
}

function createBoard(boardName) {
  return Board.create({board: boardName});
}

module.exports = {
  createThread,
  updateBoardWithThread,
  findOrCreateBoard,
  createReply,
  updateThreadWithReply,
  reportThread,
  reportReply,
  deleteThread,
  removeThreadFromBoard,
  deleteReply,
  removeReplyFromThread,
  getThreads,
  getThreadWithAllReplies,
  getAllBoards,
  findBoard,
  createBoard,
}

