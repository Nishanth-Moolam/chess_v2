const Lobby = require("../models/lobbyModel");
const Board = require("../models/boardModel");
const asyncHandler = require("express-async-handler");
const { createBoard } = require("./boardControllers");

// @description    Create a new lobby with player1
// @route          POST /api/lobby
// @access         Public
const createLobby = asyncHandler(async (req, res) => {
  // const player1 = req.body.player1;

  const lobby = new Lobby({
    board: new Board({
      state: req.body.state,
    }),
  });

  const createdLobby = await lobby.save();
  res.status(201).json(createdLobby);
});

// const updateLobby = asyncHandler(async (req, res) => {
//   const lobby = await Lobby.findById(req.params.id);

//   // if (lobby) {
//   //   lobby.board = new Board({
//   //     state: req.body.state,
//   //     previousState: lobby.board._id,
//   //   });

//   //   const updatedLobby = await lobby.save();
//   //   res.json(updatedLobby);
//   // } else {
//   //   res.status(404);
//   //   throw new Error("Lobby not found");
//   // }
// });

module.exports = { createLobby };
