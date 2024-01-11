import { Component, OnInit } from '@angular/core';
import { SocketService } from '../../socket.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrl: './lobby.component.scss',
})
export class LobbyComponent implements OnInit {
  lobbyId: string = '';
  loading: boolean = true;
  state: any = [];
  moves: any = {};

  // color whose turn it is
  boardColor: string = 'white';
  // color of the player
  color: string = '';

  // moves that are highlighted on the board
  pieceMoves: any = [];
  // whether or not to display the highlighted moves
  isMovesDisplayed: boolean = false;
  // move that is sent to the server
  selectedMove: any = {};

  constructor(
    private socketService: SocketService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.lobbyId = this.route.snapshot.paramMap.get('id') || '';
    localStorage.setItem('lobbyId', this.lobbyId);
    this.socketService.joinLobby();
    this.resetPieceMoves();
    this.socketService.state.subscribe((state: any) => {
      this.state = state;
      this.loading = false;
    });
    this.socketService.moves.subscribe((moves: any) => {
      this.moves = moves;
    });
    this.socketService.boardColor.subscribe((color: string) => {
      this.boardColor = color;
    });
    this.socketService.color.subscribe((color: string) => {
      this.color = color;
    });

    localStorage.setItem('lobbyId', this.lobbyId);
  }

  move(move: any) {
    this.socketService.move(move);
  }

  displayMoves(i: number, j: number) {
    if (
      !this.isMovesDisplayed &&
      this.state[i][j] !== '.' &&
      this.isWhite(this.state[i][j]) === (this.color === 'white') &&
      this.boardColor === this.color
    ) {
      this.isMovesDisplayed = true;
      const key = JSON.stringify([i, j]);
      if (!this.moves[key]) {
        return;
      }
      this.moves[key].forEach((move: any) => {
        const endI = +move.endPosition[0];
        const endJ = +move.endPosition[1];
        this.pieceMoves[endI][endJ] = move;
      });
    } else if (this.pieceMoves[i][j]) {
      // move the piece
      this.move(this.pieceMoves[i][j]);
      this.resetPieceMoves();
    } else {
      // clicked on a different piece
      this.resetPieceMoves();
    }
  }

  resetPieceMoves() {
    this.isMovesDisplayed = false;
    this.pieceMoves = [
      [false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false],
    ];
  }

  imageSrc(key: string) {
    switch (key) {
      case 'p':
        return 'assets/images/pawn-black.png';
      case 'P':
        return 'assets/images/pawn-white.png';
      case 'r':
        return 'assets/images/rook-black.png';
      case 'R':
        return 'assets/images/rook-white.png';
      case 'n':
        return 'assets/images/knight-black.png';
      case 'N':
        return 'assets/images/knight-white.png';
      case 'b':
        return 'assets/images/bishop-black.png';
      case 'B':
        return 'assets/images/bishop-white.png';
      case 'q':
        return 'assets/images/queen-black.png';
      case 'Q':
        return 'assets/images/queen-white.png';
      case 'k':
        return 'assets/images/king-black.png';
      case 'K':
        return 'assets/images/king-white.png';
      default:
        return '';
    }
  }

  leaveGame() {
    this.socketService.leaveLobby();
  }

  isBlack(key: string) {
    return key === key.toLowerCase();
  }

  isWhite(key: string) {
    return key === key.toUpperCase();
  }

  setPromotionPreference(preference: string) {
    this.socketService.setPromotionPreference(preference);
  }
}
