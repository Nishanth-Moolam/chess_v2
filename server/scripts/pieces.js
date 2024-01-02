class Piece {
  constructor(color, position) {
    this.color = color;
    this.position = position;
  }
  findPieceMoves(boardState, isBlackCheck, isWhiteCheck) {
    return [];
  }
}

class Pawn extends Piece {
  constructor(color, position) {
    super(color, position);
    this.type = "pawn";
  }

  findPieceMoves(boardState, isBlackCheck, isWhiteCheck) {
    let moves = {};
    moves[this.position] = moves[this.position] || [];
    let [i, j] = this.position;
    let direction = this.color === "black" ? 1 : -1;
    if (boardState[i + direction][j] === null) {
      moves[this.position].push({
        move: [{ start: [i, j], end: [i + direction, j] }],
      });
      if (this.color === "black" && i === 1) {
        moves[this.position].push({
          move: [{ start: [i, j], end: [i + 2 * direction, j] }],
        });
      } else if (this.color === "white" && i === 6) {
        moves[this.position].push({
          move: [{ start: [i, j], end: [i + 2 * direction, j] }],
        });
      }
    }
    if (
      j > 0 &&
      boardState[i + direction][j - 1] !== null &&
      boardState[i + direction][j - 1].color !== this.color
    ) {
      moves[this.position].push({
        move: [
          {
            start: [i, j],
            end: [i + direction, j - 1],
            capture: [i + direction, j - 1],
          },
        ],
      });
    }
    if (
      j < 7 &&
      boardState[i + direction][j + 1] !== null &&
      boardState[i + direction][j + 1].color !== this.color
    ) {
      moves[this.position].push({
        move: [
          {
            start: [i, j],
            end: [i + direction, j + 1],
            capture: [i + direction, j + 1],
          },
        ],
      });
    }
    return moves;
  }
}

class Rook extends Piece {
  constructor(color, position) {
    super(color, position);
    this.type = "rook";
  }

  findPieceMoves(boardState, isBlackCheck, isWhiteCheck) {
    let moves = {};
    moves[this.position] = moves[this.position] || [];
    let [i, j] = this.position;
    let directions = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];
    for (let direction of directions) {
      let [x, y] = direction;
      let [newI, newJ] = [i + x, j + y];
      while (newI >= 0 && newI < 8 && newJ >= 0 && newJ < 8) {
        if (boardState[newI][newJ] === null) {
          moves[this.position].push({
            move: [{ start: [i, j], end: [newI, newJ] }],
          });
        } else if (boardState[newI][newJ].color !== this.color) {
          moves[this.position].push({
            move: [{ start: [i, j], end: [newI, newJ], capture: [newI, newJ] }],
          });
          break;
        } else {
          break;
        }
        newI += x;
        newJ += y;
      }
    }
    return moves;
  }
}

class Knight extends Piece {
  constructor(color, position) {
    super(color, position);
    this.type = "knight";
  }

  findPieceMoves(boardState, isBlackCheck, isWhiteCheck) {
    let moves = {};
    moves[this.position] = moves[this.position] || [];
    let [i, j] = this.position;
    let directions = [
      [2, 1],
      [2, -1],
      [-2, 1],
      [-2, -1],
      [1, 2],
      [1, -2],
      [-1, 2],
      [-1, -2],
    ];
    for (let direction of directions) {
      let [x, y] = direction;
      let [newI, newJ] = [i + x, j + y];
      if (newI >= 0 && newI < 8 && newJ >= 0 && newJ < 8) {
        if (boardState[newI][newJ] === null) {
          moves[this.position].push({
            move: [{ start: [i, j], end: [newI, newJ] }],
          });
        } else if (boardState[newI][newJ].color !== this.color) {
          moves[this.position].push({
            move: [{ start: [i, j], end: [newI, newJ], capture: [newI, newJ] }],
          });
        }
      }
    }
    return moves;
  }
}

class Bishop extends Piece {
  constructor(color, position) {
    super(color, position);
    this.type = "bishop";
  }

  findPieceMoves(boardState, isBlackCheck, isWhiteCheck) {
    let moves = {};
    moves[this.position] = moves[this.position] || [];
    let [i, j] = this.position;
    let directions = [
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
    ];
    for (let direction of directions) {
      let [x, y] = direction;
      let [newI, newJ] = [i + x, j + y];
      while (newI >= 0 && newI < 8 && newJ >= 0 && newJ < 8) {
        if (boardState[newI][newJ] === null) {
          moves[this.position].push({
            move: [{ start: [i, j], end: [newI, newJ] }],
          });
        } else if (boardState[newI][newJ].color !== this.color) {
          moves[this.position].push({
            move: [{ start: [i, j], end: [newI, newJ], capture: [newI, newJ] }],
          });
          break;
        } else {
          break;
        }
        newI += x;
        newJ += y;
      }
    }
    return moves;
  }
}

class Queen extends Piece {
  constructor(color, position) {
    super(color, position);
    this.type = "queen";
  }

  findPieceMoves(boardState, isBlackCheck, isWhiteCheck) {
    let moves = {};
    moves[this.position] = moves[this.position] || [];
    let [i, j] = this.position;
    let directions = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
    ];
    for (let direction of directions) {
      let [x, y] = direction;
      let [newI, newJ] = [i + x, j + y];
      while (newI >= 0 && newI < 8 && newJ >= 0 && newJ < 8) {
        if (boardState[newI][newJ] === null) {
          moves[this.position].push({
            move: [{ start: [i, j], end: [newI, newJ] }],
          });
        } else if (boardState[newI][newJ].color !== this.color) {
          moves[this.position].push({
            move: [{ start: [i, j], end: [newI, newJ], capture: [newI, newJ] }],
          });
          break;
        } else {
          break;
        }
        newI += x;
        newJ += y;
      }
    }
    return moves;
  }
}

class King extends Piece {
  constructor(color, position) {
    super(color, position);
    this.type = "king";
  }

  findPieceMoves(boardState, isBlackCheck, isWhiteCheck) {
    let moves = {};
    moves[this.position] = moves[this.position] || [];
    let [i, j] = this.position;
    let directions = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
    ];
    for (let direction of directions) {
      let [x, y] = direction;
      let [newI, newJ] = [i + x, j + y];
      if (newI >= 0 && newI < 8 && newJ >= 0 && newJ < 8) {
        if (boardState[newI][newJ] === null) {
          moves[this.position].push({
            move: [{ start: [i, j], end: [newI, newJ] }],
          });
        } else if (boardState[newI][newJ].color !== this.color) {
          moves[this.position].push({
            move: [{ start: [i, j], end: [newI, newJ], capture: [newI, newJ] }],
          });
        }
      }
    }
    return moves;
  }
}

module.exports = { Piece, Pawn, Rook, Knight, Bishop, Queen, King };
