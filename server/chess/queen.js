const Piece = require("./piece");

class Queen extends Piece {
  constructor(color, position) {
    super(color, position);
    this.type = "queen";
  }

  findPieceMoves(state) {
    return {};
  }

  findPieceDangerSquares(state) {
    let dangerSquares = new Set();
    return dangerSquares;
  }
}

module.exports = Queen;
