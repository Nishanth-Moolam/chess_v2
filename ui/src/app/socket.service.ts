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
  promotionPreference: string = 'queen';
  color: BehaviorSubject<string> = new BehaviorSubject<string>('');
  state: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  moves: BehaviorSubject<any> = new BehaviorSubject<any>({});
  boardColor: BehaviorSubject<string> = new BehaviorSubject<string>('');
  socketId: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(
    private socket: Socket,
    private http: HttpClient,
    private router: Router
  ) {
    const lobbyId = localStorage.getItem('lobbyId');
    if (lobbyId) {
      this.joinLobby();
    }
  }

  joinLobby() {
    console.log('joining lobby');
    this.lobbyId = localStorage.getItem('lobbyId') || '';
    this.socket.emit('join_lobby', this.lobbyId);
    this.socket.on('joined_lobby', (data: any) => {
      // TODO: set color
      this.color.next('white');

      this.socketId.next(data.socketId);

      // TODO: add http request to join lobby as player
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
          console.log(res);
          this.state.next(res.state);
          this.moves.next(res.moves);
          this.boardColor.next(res.color || 'white');
        });
    });
  }

  createLobby() {
    this.http.post(`${this.apiURL}/lobby/create`, {}).subscribe((res) => {
      this.socket.emit('create_lobby', res);

      this.socket.on('created_lobby', (data: any) => {
        this.lobbyId = data._id;
        localStorage.setItem('lobbyId', data._id);
        this.router.navigate(['/lobby', this.lobbyId]);
        this.http
          .post(`${this.apiURL}/board/create/${this.lobbyId}`, {})
          .subscribe((res: any) => {
            this.state.next(res.state);
            this.moves.next(res.moves);
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
        console.log(res);
        this.socket.emit('move', {});
      });
  }

  leaveLobby() {
    console.log('leaving lobby');
    localStorage.removeItem('lobbyId');
    this.socket.emit('leave_lobby', this.lobbyId);
    this.socket.on('left_lobby', (data: any) => {
      console.log('left lobby');
    });
    this.router.navigate(['/']);
  }
}
