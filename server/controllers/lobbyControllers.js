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

const joinLobby = asyncHandler(async (req, res) => {
  const lobby = await Lobby.findById(req.params.lobbyId);
  let joinedAs = "";

  if (!lobby.white) {
    joinedAs = "white";
    lobby.white = req.body.socketId._value;
  } else {
    joinedAs = "black";
    lobby.black = req.body.socketId._value;
  }

  const updatedLobby = await lobby.save();
  res.status(201).json({
    color: joinedAs,
  });
});

module.exports = { createLobby, joinLobby };
