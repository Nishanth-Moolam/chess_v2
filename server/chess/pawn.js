const Piece = require("./piece");

class Pawn extends Piece {
  constructor(color, position) {
    super(color, position);
    this.type = "pawn";
  }

  findPieceMoves(state) {
    let moves = {};
    moves[JSON.stringify(this.position)] = moves[this.position] || [];
    let [i, j] = this.position;
    let direction = this.color === "black" ? 1 : -1;
    // convert to int
    [i, j, direction] = [+i, +j, +direction];
    if (
      i + direction >= 0 &&
      i + direction <= 7 &&
      state[i + direction][j] === null
    ) {
      moves[JSON.stringify(this.position)].push({
        endPosition: [i + direction, j],
        capture: null,
        translation: [
          {
            start: this.position,
            end: [i + direction, j],
          },
        ],
      });
    }
    if (
      ((this.color === "black" && i === 1) ||
        (this.color === "white" && i === 6)) &&
      state[i + 2 * direction][j] === null &&
      state[i + direction][j] === null
    ) {
      moves[JSON.stringify(this.position)].push({
        endPosition: [i + 2 * direction, j],
        capture: null,
        translation: [
          {
            start: this.position,
            end: [i + 2 * direction, j],
          },
        ],
      });
    }
    for (let dj in [-1, 1]) {
      if (j + dj < 0 || j + dj > 7) continue;
      if (
        state[i + direction][j + dj] &&
        state[i + direction][j + dj].color !== this.color
      ) {
        moves[JSON.stringify(this.position)].push({
          endPosition: [i + direction, j + dj],
          capture: state[i + direction][j + dj],
          translation: [
            {
              start: this.position,
              end: [i + direction, j + dj],
            },
          ],
        });
      }
    }
    // TODO: en passant
    // TODO: promotion
    return moves;
  }

  findPieceDangerSquares(state) {
    let dangerSquares = new Set();

    let [i, j] = this.position;
    let direction = this.color === "black" ? 1 : -1;
    for (let dj in [-1, 1]) {
      // convert to int
      [i, j, direction, dj] = [+i, +j, +direction, +dj];
      if (j + dj < 0 || j + dj > 7) continue;
      if (i + direction < 0 || i + direction > 7) continue;
      dangerSquares.add(JSON.stringify([i + direction, j + dj]));
    }

    return dangerSquares;
  }
}

module.exports = Pawn;
