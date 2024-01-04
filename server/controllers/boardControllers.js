const Board = require("../models/boardModel");
const asyncHandler = require("express-async-handler");
const Lobby = require("../models/lobbyModel");
const BoardState = require("../chess/boardState");

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

    // test state
    // state: [
    //   "........",
    //   "........",
    //   "........",
    //   "...n....",
    //   "........",
    //   "........",
    //   "........",
    //   "........",
    // ],
    color: "white",
  });

  const createdBoard = await board.save();

  lobby.board = createdBoard._id;
  await lobby.save();

  const boardState = new BoardState(board.state);
  const moves = boardState.findMoves();

  res.status(201).json({
    _id: createdBoard._id,
    state: createdBoard.state,
    moves: moves,
    color: createdBoard.color,
  });
});

const updateBoard = asyncHandler(async (req, res) => {
  const lobby = await Lobby.findById(req.params.lobbyId);
  const oldBoard = await Board.findById(lobby.board);
  const move = req.body.move;
  console.log("-------------------------------------".yellow.bold);
  console.log("Update board");
  console.log(move);

  boardState = new BoardState(oldBoard.state);

  const board = new Board({
    state: boardState.move(move),
    previousState: oldBoard._id,
    color: oldBoard.color === "white" ? "black" : "white",
  });

  const createdBoard = await board.save();

  lobby.board = createdBoard._id;
  await lobby.save();

  res.status(201).json({
    _id: createdBoard._id,
    state: createdBoard.state,
    color: createdBoard.color,
  });
});

const getBoard = asyncHandler(async (req, res) => {
  const lobby = await Lobby.findById(req.params.lobbyId);
  const board = await Board.findById(lobby.board);

  if (!board) {
    res.status(404);
    throw new Error("Board not found");
  }

  const boardState = new BoardState(board.state);
  const moves = boardState.findMoves();

  res.status(201).json({
    _id: board._id,
    state: board.state,
    moves: moves,
    color: board.color,
  });
});

module.exports = { createBoard, updateBoard, getBoard };
