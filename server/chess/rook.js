const Piece = require("./piece");

class Rook extends Piece {
  constructor(color, position) {
    super(color, position);
    this.type = "rook";
  }

  findPieceMoves(state) {
    return {};
  }

  findPieceDangerSquares(state) {
    let dangerSquares = new Set();
    return dangerSquares;
  }
}

module.exports = Rook;
