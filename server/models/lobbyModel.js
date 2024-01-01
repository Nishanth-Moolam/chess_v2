const mongoose = require("mongoose");

const lobbyModel = new mongoose.Schema(
  {
    // player1: { type: String, required: true, trim: true },
    // player2: { type: String, required: false, trim: true },
    board: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Board",
      required: false,
    },
    createdAt: { type: Date, default: Date.now, expires: 86400 },
  },
  {
    timestamps: true,
  }
);

const Lobby = mongoose.model("Lobby", lobbyModel);

module.exports = Lobby;
