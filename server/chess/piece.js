class Piece {
  constructor(color, position, prestine) {
    this.color = color;
    this.position = position;
    this.prestine = prestine;
  }

  /**
   * Finds the possible moves for a chess piece. Note that this does not take into account whether the move would put the player in check.
   * @param {Object} state - The current state of the chess game.
   * @returns {Object} - An object containing the possible moves for each position.
   */
  findPieceMoves(state) {
    return {
      /*
      // for each position, an array of moves
      // extract position with JSON.parse
      JSON.stringify(this.position): [
          {
            // end position to display on board
            endPosition: [i, j],
            // optional capture position of the move
            capture: [i, j],
            // type of piece
            piece: this.type,
            // color of piece
            color: this.color,
            // list of translations of pieces. Each translation has a start and end position
            // this is to handle castling and en passant
            translation: [
              {
                start: [i, j],
                end: [i, j],
              }
            ]
          }
        ]
      */
    };
  }

  /**
   * Finds all the squares that this piece is attacking.
   *
   * Danger squares include squares inhabited by allied pieces as well as squares that are protected by allied pieces.
   * @param {Object} state - The current state of the chess game.
   * @returns {Set} - A set of all squares that this piece is attacking.
   */
  findPieceDangerSquares(state) {
    // returns a set of all squares that this piece is attacking
    // extract position with JSON.parse
    return new Set();
    // JSON.stringify([i, j])
  }
}

module.exports = Piece;
