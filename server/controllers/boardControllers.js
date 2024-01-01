const Board = require("../models/boardModel");
const asyncHandler = require("express-async-handler");
const Lobby = require("../models/lobbyModel");

const createBoard = asyncHandler(async (req, res) => {
  console.log("CreateBoard called");

  const lobby = await Lobby.findById(req.params.lobbyId);

  const board = new Board({
    state: req.body.state,
  });

  const createdBoard = await board.save();

  lobby.board = createdBoard._id;
  await lobby.save();

  res.status(201).json(createdBoard);
});

const updateBoard = asyncHandler(async (req, res) => {
  console.log("UpdateBoard called");

  const lobby = await Lobby.findById(req.params.lobbyId);
  const oldBoard = await Board.findById(lobby.board);

  const board = new Board({
    state: req.body.state,
    previousState: oldBoard._id,
  });

  const createdBoard = await board.save();

  lobby.board = createdBoard._id;
  await lobby.save();

  res.status(201).json(createdBoard);
});

const getBoard = asyncHandler(async (req, res) => {
  console.log("GetBoard called");

  const lobby = await Lobby.findById(req.params.lobbyId);
  const board = await Board.findById(lobby.board);

  res.status(201).json(board);
});

module.exports = { createBoard, updateBoard, getBoard };
