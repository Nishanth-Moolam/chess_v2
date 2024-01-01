import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  lobbyId: string = '';
  apiURL: string = 'http://localhost:5000/api';

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
    this.socket.on('lobby_joined', (data: any) => {
      console.log(data);
      // get board
    });

    this.socket.on('lobby_full', (data: any) => {
      console.log('lobby full');
    });

    this.socket.on('moved', (data: any) => {
      console.log(data);
      // get board
    });
  }

  createLobby() {
    this.http
      .post(`${this.apiURL}/lobby/create`, {
        state: [],
      })
      .subscribe((res) => {
        console.log(res);
        this.socket.emit('create_lobby', res);

        this.socket.on('created_lobby', (data: any) => {
          this.lobbyId = data._id;
          localStorage.setItem('lobbyId', data._id);
          this.router.navigate(['/lobby', this.lobbyId]);
          // create board
        });
      });
  }

  move() {
    console.log('move called');
    this.socket.emit('move', {
      state: [],
    });
  }

  updateBoard(lobbyId: string, state: any) {
    this.http
      .post(`${this.apiURL}/lobby/update/${lobbyId}`, {
        state: state,
      })
      .subscribe((res) => {
        console.log(res);
      });
  }
}
