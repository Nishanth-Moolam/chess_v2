const { Piece, Pawn, Rook, Knight, Bishop, King, Queen } = require("./pieces");

const findMoves = (state) => {
  boardState = convertToBoardState(state);
  blackKingPosition = null;
  whiteKingPosition = null;
  isBlackCheck = false;
  isWhiteCheck = false;

  moves = {};

  for (let i = 0; i < boardState.length; i++) {
    for (let j = 0; j < boardState[i].length; j++) {
      if (boardState[i][j] !== null) {
        // Find all moves
        moves = {
          ...moves,
          ...boardState[i][j].findPieceMoves(
            boardState,
            isBlackCheck,
            isWhiteCheck
          ),
        };

        // Find king positions
        if (boardState[i][j].type === "king") {
          if (boardState[i][j].color === "black") {
            blackKingPosition = [i, j];
          } else {
            whiteKingPosition = [i, j];
          }
        }
      }
    }
  }

  for (let movePosition in moves) {
    for (let move of moves[movePosition]) {
      // Check if king is in check
      if (
        move.capture &&
        move.capture[0] === blackKingPosition[0] &&
        move.capture[1] === blackKingPosition[1]
      ) {
        isBlackCheck = true;
      } else if (
        move.capture &&
        move.capture[0] === whiteKingPosition[0] &&
        move.capture[1] === whiteKingPosition[1]
      ) {
        isWhiteCheck = true;
      }
    }
  }

  return {
    moves: moves,
    isBlackCheck: isBlackCheck,
    isWhiteCheck: isWhiteCheck,
  };
};

const convertToBoardState = (state) => {
  boardState = [];
  for (let i = 0; i < state.length; i++) {
    boardState.push([]);
    for (let j = 0; j < state[i].length; j++) {
      switch (state[i][j]) {
        case "p":
          boardState[i].push(new Pawn("black", [i, j]));
          break;
        case "r":
          boardState[i].push(new Rook("black", [i, j]));
          break;
        case "n":
          boardState[i].push(new Knight("black", [i, j]));
          break;
        case "b":
          boardState[i].push(new Bishop("black", [i, j]));
          break;
        case "q":
          boardState[i].push(new Queen("black", [i, j]));
          break;
        case "k":
          boardState[i].push(new King("black", [i, j]));
          break;
        case "P":
          boardState[i].push(new Pawn("white", [i, j]));
          break;
        case "R":
          boardState[i].push(new Rook("white", [i, j]));
          break;
        case "N":
          boardState[i].push(new Knight("white", [i, j]));
          break;
        case "B":
          boardState[i].push(new Bishop("white", [i, j]));
          break;
        case "Q":
          boardState[i].push(new Queen("white", [i, j]));
          break;
        case "K":
          boardState[i].push(new King("white", [i, j]));
          break;
        default:
          boardState[i].push(null);
          break;
      }
    }
  }
  return boardState;
};

const convertToState = (boardState) => {
  state = [];
  for (let i = 0; i < boardState.length; i++) {
    state.push("");
    for (let j = 0; j < boardState[i].length; j++) {
      if (boardState[i][j] === null) {
        state[i] += ".";
      } else {
        switch (boardState[i][j].type) {
          case "pawn":
            state[i] += boardState[i][j].color === "black" ? "p" : "P";
            break;
          case "rook":
            state[i] += boardState[i][j].color === "black" ? "r" : "R";
            break;
          case "knight":
            state[i] += boardState[i][j].color === "black" ? "n" : "N";
            break;
          case "bishop":
            state[i] += boardState[i][j].color === "black" ? "b" : "B";
            break;
          case "queen":
            state[i] += boardState[i][j].color === "black" ? "q" : "Q";
            break;
          case "king":
            state[i] += boardState[i][j].color === "black" ? "k" : "K";
            break;
          default:
            state[i] += ".";
            break;
        }
      }
    }
  }
  return state;
};

module.exports = findMoves;
