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
  state: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

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
    this.socket.on('joined_lobby', () => {
      this.http
        .get(`${this.apiURL}/board/${this.lobbyId}`)
        .subscribe((res: any) => {
          this.state.next(res.state);
        });
    });

    this.socket.on('lobby_full', (data: any) => {
      console.log('lobby full');
    });

    this.socket.on('moved', () => {
      this.http
        .get(`${this.apiURL}/board/${this.lobbyId}`)
        .subscribe((res: any) => {
          this.state.next(res.state);
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
          });
      });
    });
  }

  move(state: any) {
    this.updateBoard(this.lobbyId, state);
  }

  updateBoard(lobbyId: string, state: any) {
    this.http
      .post(`${this.apiURL}/board/update/${lobbyId}`, {
        state: state,
      })
      .subscribe((res) => {
        console.log(res);
        this.socket.emit('move', {});
      });
  }
}
