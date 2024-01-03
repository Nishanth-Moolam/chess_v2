const Piece = require("./piece");

class Knight extends Piece {
  constructor(color, position) {
    super(color, position);
    this.type = "knight";
  }

  findPieceMoves(state) {
    return {};
  }

  findPieceDangerSquares(state) {
    let dangerSquares = new Set();
    return dangerSquares;
  }
}

module.exports = Knight;
