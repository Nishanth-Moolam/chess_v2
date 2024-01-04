const Piece = require("./piece");

class Rook extends Piece {
  constructor(color, position) {
    super(color, position);
    this.type = "rook";
  }

  findPieceMoves(state) {
    let moves = {};
    moves[JSON.stringify(this.position)] = moves[this.position] || [];
    let [i, j] = this.position;
    let directions = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];
    // convert to int
    [i, j] = [+i, +j];

    for (let direction of directions) {
      let [di, dj] = direction;
      let [newI, newJ] = [i + di, j + dj];
      while (newI >= 0 && newI <= 7 && newJ >= 0 && newJ <= 7) {
        if (state[newI][newJ] === null) {
          moves[JSON.stringify(this.position)].push({
            endPosition: [newI, newJ],
            capture: null,
            translation: [
              {
                start: this.position,
                end: [newI, newJ],
              },
            ],
          });
        } else if (state[newI][newJ].color !== this.color) {
          moves[JSON.stringify(this.position)].push({
            endPosition: [newI, newJ],
            capture: [newI, newJ],
            translation: [
              {
                start: this.position,
                end: [newI, newJ],
              },
            ],
          });
          break;
        } else {
          break;
        }
        newI += di;
        newJ += dj;
      }
    }

    return moves;
  }

  findPieceDangerSquares(state) {
    let dangerSquares = new Set();

    let [i, j] = this.position;
    [i, j] = [+i, +j];
    let directions = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];

    for (let direction of directions) {
      let [di, dj] = direction;
      let [newI, newJ] = [i + di, j + dj];
      while (newI >= 0 && newI <= 7 && newJ >= 0 && newJ <= 7) {
        dangerSquares.add(JSON.stringify([newI, newJ]));
        if (state[newI][newJ] !== null) {
          break;
        }
        newI += di;
        newJ += dj;
      }
    }

    return dangerSquares;
  }
}

module.exports = Rook;
