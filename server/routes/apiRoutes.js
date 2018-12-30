const router = require('express').Router();

const {
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
} = require('../models/queryFunctions');

// POST - create a discussion board

router.post('/new/:board', async (req, res) => {
  try {
    let { board: boardName } = req.params;
    let foundBoard = await findBoard(boardName.toLowerCase())
    if (foundBoard) {
      return res.status(404).send('Board already exists');
    } else {
      let newBoard = await createBoard(boardName);
      return res.status(200).json(newBoard);
    }
  } catch (error) {
    return res.status(500).json({error: error.message});    
  }
});

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

// POST - a reply to a specific "thread" by passing form data (text, delete_password & thread_id). 
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

// DELETE - delete a thread by giving thread_id and delete_password, latter should match the one in the DB.

router.delete('/threads/:board', async (req, res) => {
  try {
    const { thread_id, delete_password } = req.body;
    const { board: boardName } = req.params;
    const deletedThread = await deleteThread(thread_id, delete_password);
    if (deletedThread) {
      let updatedBoard = await removeThreadFromBoard(boardName, thread_id);
      res.status(200).send('success');
    } else {
      res.status(404).send('incorrect password');
    }
  } catch (error) {
    res.status(500).json({error: error.message});        
  }
});

// DELETE - delete a reply by giving thread_id, reply_id and delete_password.

router.delete('/replies/:board', async (req, res) => {
  try {
    const { thread_id, reply_id, delete_password } = req.body;
    const { board: boardName } = req.params;
    const deletedReply = await deleteReply(reply_id, delete_password);
    if (deletedReply) {
      let updatedThread = await removeReplyFromThread(thread_id, reply_id);
      res.status(200).send('success')
    } else {
      res.status(404).send('incorrect password');
    }
  } catch (error) {
    res.status(500).json({error: error.message});            
  }
});

// GET - an array of most recent 10 bumped threads, with only the most recent 3 replies.
// The "reported" and "delete_password" field will not be sent

router.get('/threads/:board', async (req, res) => {
  try {
    const { board: boardName } = req.params;
    const threads = await getThreads(boardName);
    if (threads) {
      res.status(200).json(threads);
    } else {
      res.status(404).send('bad request');
    }
  } catch (error) {
    res.json({error: error.message});
  }
});

// GET - an entire thread with all it's replies, being passed thread_id in query params, hiding reported & delete_password 

router.get('/replies/:board', async (req, res) => {
  try {
    const { board: boardName } = req.params;
    const { thread_id } = req.query;
    const thread = await getThreadWithAllReplies(thread_id);
    if (thread) {
      res.status(200).json(thread);
    } else {
      res.status(404).send('bad request');
    }
  } catch (error) {
    res.status(500).json({error: error.message});    
  }
});

// GET - list of all boards

router.get('/boards', async (req, res) => {
  try {
    let boards = await getAllBoards();
    if (boards) {
      res.status(200).json(boards);
    } else {
      res.status(404).send('bad request');
    }
  } catch (error) {
    res.status(500).json({error: error.message});        
  }
});

module.exports = router;