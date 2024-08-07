const Pawn = require("./pawn");
const Rook = require("./rook");
const Knight = require("./knight");
const Bishop = require("./bishop");
const King = require("./king");
const Queen = require("./queen");
const _ = require("lodash");

class BoardState {
  constructor(stringState, prestine, promotionPreference) {
    console.log("boardState promotionPreference", promotionPreference);
    this.promotionPreference = promotionPreference;
    this.state = this.getState(stringState, prestine);
  }

  findMoves() {
    const allMoves = this.findAllMoves(this.state);
    const validatedMoves = this.validateMoves(this.state, allMoves);

    return validatedMoves;
  }

  move(move) {
    // TODO: promotion preference must be in model
    // this.promotionPreference = promotionPreference;
    this.state = this.propogateMove(this.state, move);

    return this.getStringState();
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
      newState[translate.end[0]][translate.end[1]].prestine =
        newState[translate.end[0]][translate.end[1]].prestine < 9
          ? newState[translate.end[0]][translate.end[1]].prestine + 1
          : 9;
    }
    // TODO: this breaks if the pawn is promoted and on castling
    return newState;
  }

  isCheckString(stringState, prestine, color) {
    let state = this.getState(stringState, prestine);
    return this.isCheck(state, color);
  }

  isCheckmateString(stringState, prestine, color, moves) {
    if (!this.isCheckString(stringState, prestine, color)) {
      return false;
    } else {
      for (let position in moves) {
        let [i, j] = JSON.parse(position);
        [i, j] = [+i, +j];
        if (this.state[i][j].color === color) {
          if (moves[position].length > 0) {
            return false;
          }
        }
      }
      return true;
    }
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

  getState(stringState, prestine) {
    let state = [];

    for (let i = 0; i < stringState.length; i++) {
      state.push([]);
      for (let j = 0; j < stringState[i].length; j++) {
        switch (stringState[i][j]) {
          case "p":
            if (i === 0 || i === 7) {
              console.log(this.promotionPreference);
              switch (this.promotionPreference) {
                case "queen":
                  state[i].push(new Queen("black", [i, j], +prestine[i][j]));
                  break;
                case "rook":
                  state[i].push(new Rook("black", [i, j], +prestine[i][j]));
                  break;
                case "knight":
                  state[i].push(new Knight("black", [i, j], +prestine[i][j]));
                  break;
                case "bishop":
                  state[i].push(new Bishop("black", [i, j], +prestine[i][j]));
                  break;
                default:
                  state[i].push(new Queen("black", [i, j], +prestine[i][j]));
                  break;
              }
            } else {
              state[i].push(new Pawn("black", [i, j], +prestine[i][j]));
            }
            break;
          case "r":
            state[i].push(new Rook("black", [i, j], +prestine[i][j]));
            break;
          case "n":
            state[i].push(new Knight("black", [i, j], +prestine[i][j]));
            break;
          case "b":
            state[i].push(new Bishop("black", [i, j], +prestine[i][j]));
            break;
          case "q":
            state[i].push(new Queen("black", [i, j], +prestine[i][j]));
            break;
          case "k":
            state[i].push(new King("black", [i, j], +prestine[i][j]));
            break;
          case "P":
            if (i === 0 || i === 7) {
              switch (this.promotionPreference) {
                case "queen":
                  state[i].push(new Queen("white", [i, j], +prestine[i][j]));
                  break;
                case "rook":
                  state[i].push(new Rook("white", [i, j], +prestine[i][j]));
                  break;
                case "knight":
                  state[i].push(new Knight("white", [i, j], +prestine[i][j]));
                  break;
                case "bishop":
                  state[i].push(new Bishop("white", [i, j], +prestine[i][j]));
                  break;
                default:
                  state[i].push(new Queen("white", [i, j], +prestine[i][j]));
                  break;
              }
            } else {
              state[i].push(new Pawn("white", [i, j], +prestine[i][j]));
            }
            break;
          case "R":
            state[i].push(new Rook("white", [i, j], +prestine[i][j]));
            break;
          case "N":
            state[i].push(new Knight("white", [i, j], +prestine[i][j]));
            break;
          case "B":
            state[i].push(new Bishop("white", [i, j], +prestine[i][j]));
            break;
          case "Q":
            state[i].push(new Queen("white", [i, j], +prestine[i][j]));
            break;
          case "K":
            state[i].push(new King("white", [i, j], +prestine[i][j]));
            break;
          default:
            state[i].push(null);
            break;
        }
      }
    }
    return state;
  }

  getStringState() {
    let stringState = [];
    let prestine = [];

    for (let i = 0; i < this.state.length; i++) {
      stringState.push("");
      prestine.push("");
      for (let j = 0; j < this.state[i].length; j++) {
        if (this.state[i][j] === null) {
          stringState[i] += ".";
          prestine[i] += ".";
        } else {
          prestine[i] += this.state[i][j].prestine.toString();
          switch (this.state[i][j].type) {
            case "pawn":
              stringState[i] += this.state[i][j].color === "black" ? "p" : "P";
              break;
            case "rook":
              stringState[i] += this.state[i][j].color === "black" ? "r" : "R";
              break;
            case "knight":
              stringState[i] += this.state[i][j].color === "black" ? "n" : "N";
              break;
            case "bishop":
              stringState[i] += this.state[i][j].color === "black" ? "b" : "B";
              break;
            case "queen":
              stringState[i] += this.state[i][j].color === "black" ? "q" : "Q";
              break;
            case "king":
              stringState[i] += this.state[i][j].color === "black" ? "k" : "K";
              break;
            default:
              stringState[i] += ".";
              break;
          }
        }
      }
    }
    return { stringState: stringState, prestine: prestine };
  }
}

module.exports = BoardState;
