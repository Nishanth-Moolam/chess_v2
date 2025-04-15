import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  lobbyId: string = '';
  apiURL: string = 'http://localhost:5000/api';
  promotionPreference: string = 'knight';
  color: BehaviorSubject<string> = new BehaviorSubject<string>('');
  state: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  moves: BehaviorSubject<any> = new BehaviorSubject<any>({});
  history: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  boardColor: BehaviorSubject<string> = new BehaviorSubject<string>('');
  socketId: BehaviorSubject<string> = new BehaviorSubject<string>('');

  isBlackCheck: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isBlackCheckmate: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  isWhiteCheck: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isWhiteCheckmate: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  constructor(
    private socket: Socket,
    private http: HttpClient,
    private router: Router
  ) {}

  joinLobby() {
    console.log('joining lobby');
    this.lobbyId = localStorage.getItem('lobbyId') || '';
    this.socket.emit('join_lobby', this.lobbyId);
    this.socket.on('joined_lobby', (data: any) => {
      this.socketId.next(data.socketId);

      this.http
        .post(`${this.apiURL}/lobby/join/${this.lobbyId}`, {
          socketId: this.socketId,
        })
        .subscribe((res: any) => {
          this.color.next(res.color || 'white');
        });

      this.http
        .get(`${this.apiURL}/board/${this.lobbyId}`)
        .subscribe((res: any) => {
          this.state.next(res.state);
          this.moves.next(res.moves);
          this.history.next(res.history);
          this.boardColor.next(res.color || 'white');
        });
      console.log('joined lobby');
    });

    this.socket.on('lobby_full', (data: any) => {
      console.log('lobby full');
    });

    this.socket.on('moved', () => {
      this.http
        .get(`${this.apiURL}/board/${this.lobbyId}`)
        .subscribe((res: any) => {
          console.log('moved');
          this.state.next(res.state);
          this.moves.next(res.moves);
          this.history.next(res.history);
          this.boardColor.next(res.color || 'white');
          this.isBlackCheck.next(res.isBlackCheck);
          this.isBlackCheckmate.next(res.isBlackCheckmate);
          this.isWhiteCheck.next(res.isWhiteCheck);
          this.isWhiteCheckmate.next(res.isWhiteCheckmate);
        });
    });
  }

  createLobby() {
    this.http.post(`${this.apiURL}/lobby/create`, {}).subscribe((res) => {
      this.socket.emit('create_lobby', res);
      this.socket.on('created_lobby', (data: any) => {
        this.lobbyId = data._id;
        localStorage.setItem('lobbyId', data._id);
        this.http
          .post(`${this.apiURL}/board/create/${this.lobbyId}`, {})
          .subscribe((res: any) => {
            this.state.next(res.state);
            this.moves.next(res.moves);
            this.isBlackCheck.next(false);
            this.isBlackCheckmate.next(false);
            this.isWhiteCheck.next(false);
            this.isWhiteCheckmate.next(false);
            this.router.navigate(['/lobby', this.lobbyId]);
          });
      });
    });
  }

  move(move: any) {
    this.updateBoard(this.lobbyId, this.promotionPreference, move);
  }

  updateBoard(lobbyId: string, promotionPreference: string, move: any) {
    this.http
      .post(`${this.apiURL}/board/update/${lobbyId}`, {
        move: move,
        promotionPreference: promotionPreference,
      })
      .subscribe((res) => {
        this.socket.emit('move', {});
      });
  }

  leaveLobby() {
    console.log('leaving lobby');
    localStorage.removeItem('lobbyId');
    this.socket.emit('leave_lobby', this.lobbyId);
    this.socket.on('left_lobby', (data: any) => {
      this.http
        .post(`${this.apiURL}/lobby/leave/${this.lobbyId}`, {
          socketId: data.socketId,
        })
        .subscribe((res) => {
          // console.log(res);
        });
    });
    this.socketId.next('');
    this.router.navigate(['/']);
    // TODO: reset all BehaviorSubjects
  }

  setPromotionPreference(preference: string) {
    this.promotionPreference = preference;
  }

  getLobbyId() {
    return this.lobbyId || '';
  }
}
