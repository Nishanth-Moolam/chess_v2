const Board = require("../models/boardModel");
const asyncHandler = require("express-async-handler");
const Lobby = require("../models/lobbyModel");
const findMoves = require("../scripts/findMoves");

const createBoard = asyncHandler(async (req, res) => {
  const lobby = await Lobby.findById(req.params.lobbyId);

  const board = new Board({
    // lower case is black, n is knight, k is king, etc.
    state: [
      "rnbqkbnr",
      "pppppppp",
      "........",
      "........",
      "........",
      "........",
      "PPPPPPPP",
      "RNBQKBNR",
    ],
  });

  const createdBoard = await board.save();

  lobby.board = createdBoard._id;
  await lobby.save();

  res.status(201).json(createdBoard);
});

const updateBoard = asyncHandler(async (req, res) => {
  const lobby = await Lobby.findById(req.params.lobbyId);
  const oldBoard = await Board.findById(lobby.board);

  const board = new Board({
    state: req.body.state,
    previousState: oldBoard._id,
  });

  moves = findMoves(req.body.state);
  console.log("-------------------------------------".yellow.bold);
  console.log("Moves List");
  console.log(JSON.stringify(moves.moves, null, 1));
  console.log("Is Black Check");
  console.log(moves.isBlackCheck);
  console.log("Is White Check");
  console.log(moves.isWhiteCheck);

  console.log("State");
  console.log(req.body.state);

  const createdBoard = await board.save();

  lobby.board = createdBoard._id;
  await lobby.save();

  res.status(201).json(createdBoard);
});

const getBoard = asyncHandler(async (req, res) => {
  const lobby = await Lobby.findById(req.params.lobbyId);
  const board = await Board.findById(lobby.board);

  res.status(201).json(board);
});

module.exports = { createBoard, updateBoard, getBoard };
