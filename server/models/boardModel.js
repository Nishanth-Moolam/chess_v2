const mongoose = require("mongoose");

const boardModel = new mongoose.Schema(
  {
    state: { type: Array, required: true },
    previousState: {
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

const Board = mongoose.model("Board", boardModel);

module.exports = Board;