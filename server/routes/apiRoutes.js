const router = require('express').Router();

const {
  createThread,
  updateBoardWithThread,
  findOrCreateBoard,
  createReply,
  updateThreadWithReply,
  reportThread,
  reportReply,
} = require('../models/queryFunctions');


// POST - a thread to a specific "board" by passing form data (text & delete_password)

router.post('/threads/:board', async (req, res) => {
  try {
    const { text, delete_password } = req.body;
    const boardName = req.params.board;
    const board = await findOrCreateBoard(boardName);
    const newThread = await createThread(text, delete_password);
    const updatedBoard = await updateBoardWithThread(board.board, newThread._id);
    res.status(200).json(newThread);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
});

// POST - a reply to a specific "board" by passing form data (text, delete_password & thread_id). 
// this will also update the bumped_on date of the thread.

router.post('/replies/:board', async (req, res) => {
  try {
    const { text, delete_password, thread_id } = req.body;
    const boardName = req.params.board;
    const board = await findOrCreateBoard(boardName);
    const newReply = await createReply(text, delete_password);
    const updatedThread = await updateThreadWithReply(thread_id, newReply._id);
    res.status(200).json(newReply);
  } catch (error) {
    res.status(500).json({error: error.message})
  }
});


// PUT - marking a thread as reported

router.put('/threads/:board', async (req, res) => {
  try {
    const { thread_id } = req.body;
    const boardName = req.params.board;
    let updatedThread = await reportThread(thread_id);
    if (updatedThread) {
      res.status(200).send('success');
    } else {
      res.status(404).send('failed');
    }
  } catch (error) {
    res.status(500).json({error: error.message});
  }
});

// PUT - marking a reply as reported

router.put('/replies/:board', async (req, res) => {
  try {
    const { thread_id, reply_id } = req.body;
    const boardName = req.params.board;
    let updatedReply = await reportReply(reply_id);
    if (updatedReply) {
      res.status(200).send('success');
    } else {
      res.status(404).send('failed');
    }
  } catch (error) {
    res.status(500).json({error: error.message});    
  }
});

module.exports = router;