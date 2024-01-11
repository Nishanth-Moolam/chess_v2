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
    // for display purposes only. Undo moves by going back to previous state
    movesHistory: [],
    // used for castling and en passant
    prestine: [
      "00000000",
      "00000000",
      "........",
      "........",
      "........",
      "........",
      "00000000",
      "00000000",
    ],
    // white goes first
    color: "white",
  });

  const createdBoard = await board.save();

  lobby.board = createdBoard._id;
  await lobby.save();

  const boardState = new BoardState(board.state, board.prestine);
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

  boardState = new BoardState(oldBoard.state, oldBoard.prestine);

  const newBoardState = boardState.move(move, req.body.promotionPreference);

  const board = new Board({
    state: newBoardState.stringState,
    previousState: oldBoard._id,
    movesHistory: [...oldBoard.movesHistory, move],
    prestine: newBoardState.prestine,
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

  // this causes errors when board takes too long to find
  if (!board) {
    res.status(404);
    throw new Error("Board not found");
  }

  const boardState = new BoardState(board.state, board.prestine);
  const moves = boardState.findMoves();
  const { stringState, prestine } = boardState.getStringState();
  const isBlackCheck = boardState.isCheckString(stringState, prestine, "black");
  const isBlackCheckmate = boardState.isCheckmateString(
    stringState,
    prestine,
    "black",
    moves
  );
  const isWhiteCheck = boardState.isCheckString(stringState, prestine, "white");
  const isWhiteCheckmate = boardState.isCheckmateString(
    stringState,
    prestine,
    "white",
    moves
  );

  res.status(201).json({
    _id: board._id,
    state: stringState,
    moves: moves,
    color: board.color,
    isBlackCheck: isBlackCheck,
    isBlackCheckmate: isBlackCheckmate,
    isWhiteCheck: isWhiteCheck,
    isWhiteCheckmate: isWhiteCheckmate,
  });
});

module.exports = { createBoard, updateBoard, getBoard };
