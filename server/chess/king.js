const Piece = require("./piece");

class King extends Piece {
  constructor(color, position, prestine) {
    super(color, position, prestine);
    this.type = "king";
  }

  findPieceMoves(state) {
    let moves = {};

    moves[JSON.stringify(this.position)] = moves[this.position] || [];
    let [i, j] = this.position;
    [i, j][(+i, +j)];
    let directions = [
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];

    for (let direction of directions) {
      let [di, dj] = direction;
      let [newI, newJ] = [i + di, j + dj];
      if (newI >= 0 && newI <= 7 && newJ >= 0 && newJ <= 7) {
        if (state[newI][newJ] === null) {
          moves[JSON.stringify(this.position)].push({
            endPosition: [newI, newJ],
            piece: this.type,
            color: this.color,
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
            piece: this.type,
            color: this.color,
            capture: [newI, newJ],
            translation: [
              {
                start: this.position,
                end: [newI, newJ],
              },
            ],
          });
        }
      }
    }

    // castling
    if (this.prestine === 0) {
      if (
        state[i][j + 1] === null &&
        state[i][j + 2] === null &&
        state[i][j + 3] !== null &&
        state[i][j + 3].prestine === 0
      ) {
        moves[JSON.stringify(this.position)].push({
          endPosition: [i, j + 2],
          piece: this.type,
          color: this.color,
          capture: null,
          translation: [
            {
              start: this.position,
              end: [i, j + 2],
            },
            {
              start: [i, j + 3],
              end: [i, j + 1],
            },
          ],
        });
      }
      if (
        state[i][j - 1] === null &&
        state[i][j - 2] === null &&
        state[i][j - 3] === null &&
        state[i][j - 4] !== null &&
        state[i][j - 4].prestine === 0
      ) {
        moves[JSON.stringify(this.position)].push({
          endPosition: [i, j - 2],
          piece: this.type,
          color: this.color,
          capture: null,
          translation: [
            {
              start: this.position,
              end: [i, j - 2],
            },
            {
              start: [i, j - 4],
              end: [i, j - 1],
            },
          ],
        });
      }
    }

    return moves;
  }

  findPieceDangerSquares(state) {
    let dangerSquares = new Set();

    let [i, j] = this.position;
    [i, j] = [+i, +j];
    let directions = [
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];

    for (let direction of directions) {
      let [di, dj] = direction;
      let [newI, newJ] = [i + di, j + dj];
      if (newI >= 0 && newI <= 7 && newJ >= 0 && newJ <= 7) {
        dangerSquares.add(JSON.stringify([newI, newJ]));
      }
    }

    return dangerSquares;
  }
}

module.exports = King;
