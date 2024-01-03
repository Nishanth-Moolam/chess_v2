const Piece = require("./piece");

class King extends Piece {
  constructor(color, position) {
    super(color, position);
    this.type = "king";
  }

  findPieceMoves(state) {
    return {};
  }

  findPieceDangerSquares(state) {
    let dangerSquares = new Set();
    return dangerSquares;
  }
}

module.exports = King;
