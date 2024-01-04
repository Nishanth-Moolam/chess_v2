const Pawn = require("./pawn");
const Rook = require("./rook");
const Knight = require("./knight");
const Bishop = require("./bishop");
const King = require("./king");
const Queen = require("./queen");
const _ = require("lodash");

class BoardState {
  constructor(stringState) {
    this.state = this.getState(stringState);
  }

  findMoves() {
    const allMoves = this.findAllMoves(this.state);
    const validatedMoves = this.validateMoves(this.state, allMoves);

    return validatedMoves;
  }

  move(move) {
    this.state = this.propogateMove(this.state, move);
    return this.getStringState(this.state);
  }

  findAllMoves(state) {
    let moves = {};

    for (let i = 0; i < state.length; i++) {
      for (let j = 0; j < state[i].length; j++) {
        if (state[i][j] !== null) {
          moves = { ...moves, ...state[i][j].findPieceMoves(state) };
        }
      }
    }
    return moves;
  }

  validateMoves(state, moves) {
    let validatedMoves = {};

    for (let position in moves) {
      let [i, j] = JSON.parse(position);
      [i, j] = [+i, +j];
      const color = state[i][j].color;
      for (let move of moves[position]) {
        let newState = this.propogateMove(state, move);
        if (!this.isCheck(newState, color)) {
          validatedMoves[position] = validatedMoves[position] || [];
          validatedMoves[position].push(move);
        }
      }
    }
    return validatedMoves;
  }

  propogateMove(state, move) {
    let newState = _.cloneDeep(state);
    if (move.capture) {
      newState[move.capture[0]][move.capture[1]] = null;
    }
    for (let translate of move.translation) {
      newState[translate.end[0]][translate.end[1]] =
        newState[translate.start[0]][translate.start[1]];
      newState[translate.start[0]][translate.start[1]] = null;
    }
    // TODO: this breaks if the pawn is promoted and on castling
    return newState;
  }

  isCheckString(stringState, color) {
    let state = this.getState(stringState);
    return this.isCheck(state, color);
  }

  isCheck(state, color) {
    let kingPosition = JSON.stringify(this.findKing(state, color));
    let dangerSquares = this.findDangerSquares(state, color);

    return dangerSquares.has(kingPosition);
  }

  findKing(state, color) {
    let kingPosition = null;

    for (let i = 0; i < state.length; i++) {
      for (let j = 0; j < state[i].length; j++) {
        if (state[i][j] !== null) {
          if (state[i][j].type === "king" && state[i][j].color === color) {
            kingPosition = [i, j];
          }
        }
      }
    }

    return kingPosition;
  }

  findDangerSquares(state, color) {
    let dangerSquares = new Set();

    for (let i = 0; i < state.length; i++) {
      for (let j = 0; j < state[i].length; j++) {
        if (state[i][j] !== null) {
          if (state[i][j].color !== color) {
            let pieceDangerSquares = state[i][j].findPieceDangerSquares(state);
            for (let square of pieceDangerSquares) {
              dangerSquares.add(square);
            }
          }
        }
      }
    }
    return dangerSquares;
  }

  getState(stringState) {
    let state = [];

    for (let i = 0; i < stringState.length; i++) {
      state.push([]);
      for (let j = 0; j < stringState[i].length; j++) {
        switch (stringState[i][j]) {
          case "p":
            state[i].push(new Pawn("black", [i, j]));
            break;
          case "r":
            state[i].push(new Rook("black", [i, j]));
            break;
          case "n":
            state[i].push(new Knight("black", [i, j]));
            break;
          case "b":
            state[i].push(new Bishop("black", [i, j]));
            break;
          case "q":
            state[i].push(new Queen("black", [i, j]));
            break;
          case "k":
            state[i].push(new King("black", [i, j]));
            break;
          case "P":
            state[i].push(new Pawn("white", [i, j]));
            break;
          case "R":
            state[i].push(new Rook("white", [i, j]));
            break;
          case "N":
            state[i].push(new Knight("white", [i, j]));
            break;
          case "B":
            state[i].push(new Bishop("white", [i, j]));
            break;
          case "Q":
            state[i].push(new Queen("white", [i, j]));
            break;
          case "K":
            state[i].push(new King("white", [i, j]));
            break;
          default:
            state[i].push(null);
            break;
        }
      }
    }
    return state;
  }

  getStringState(state) {
    let stringState = [];

    for (let i = 0; i < state.length; i++) {
      stringState.push("");
      for (let j = 0; j < state[i].length; j++) {
        if (state[i][j] === null) {
          stringState[i] += ".";
        } else {
          switch (state[i][j].type) {
            case "pawn":
              stringState[i] += state[i][j].color === "black" ? "p" : "P";
              break;
            case "rook":
              stringState[i] += state[i][j].color === "black" ? "r" : "R";
              break;
            case "knight":
              stringState[i] += state[i][j].color === "black" ? "n" : "N";
              break;
            case "bishop":
              stringState[i] += state[i][j].color === "black" ? "b" : "B";
              break;
            case "queen":
              stringState[i] += state[i][j].color === "black" ? "q" : "Q";
              break;
            case "king":
              stringState[i] += state[i][j].color === "black" ? "k" : "K";
              break;
            default:
              stringState[i] += ".";
              break;
          }
        }
      }
    }
    return stringState;
  }
}

module.exports = BoardState;
