const Piece = require("./piece");

class Bishop extends Piece {
  constructor(color, position) {
    super(color, position);
    this.type = "bishop";
  }

  findPieceMoves(state) {
    return {};
  }

  findPieceDangerSquares(state) {
    let dangerSquares = new Set();
    return dangerSquares;
  }
}

module.exports = Bishop;
