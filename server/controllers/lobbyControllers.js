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

  if (
    lobby.white === req.body.socketId._value ||
    lobby.black === req.body.socketId._value
  ) {
    joinedAs = lobby.white === req.body.socketId._value ? "white" : "black";
  }
  if (!lobby.white) {
    joinedAs = "white";
    lobby.white = req.body.socketId._value;
  } else if (!lobby.black) {
    joinedAs = "black";
    lobby.black = req.body.socketId._value;
  } else {
    res.status(400);
    throw new Error("Lobby is full");
  }

  const updatedLobby = await lobby.save();
  // console.log("Updated lobby");
  // console.log(updatedLobby);
  res.status(201).json({
    color: joinedAs,
  });
});

const leaveLobby = asyncHandler(async (req, res) => {
  const lobby = await Lobby.findById(req.params.lobbyId);
  let leftAs = "";

  if (lobby.white === req.body.socketId) {
    leftAs = "white";
    lobby.white = null;
  }
  if (lobby.black === req.body.socketId) {
    leftAs = "black";
    lobby.black = null;
  }

  const updatedLobby = await lobby.save();
  // console.log("left lobby");
  // console.log(updatedLobby);
  res.status(201).json({
    color: leftAs,
  });
});

module.exports = { createLobby, joinLobby, leaveLobby };
