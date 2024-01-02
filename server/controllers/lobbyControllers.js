const Lobby = require("../models/lobbyModel");
const Board = require("../models/boardModel");
const asyncHandler = require("express-async-handler");
const { createBoard } = require("./boardControllers");

// @description    Create a new lobby with player1
// @route          POST /api/lobby
// @access         Public
const createLobby = asyncHandler(async (req, res) => {
  const lobby = new Lobby({});

  const createdLobby = await lobby.save();
  res.status(201).json(createdLobby);
});

module.exports = { createLobby };
