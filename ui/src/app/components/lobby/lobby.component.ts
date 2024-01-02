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
  state: any = [];

  constructor(
    private socketService: SocketService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.lobbyId = this.route.snapshot.paramMap.get('id') || '';
    this.socketService.state.subscribe((state: any) => {
      this.state = state;
    });
    localStorage.setItem('lobbyId', this.lobbyId);
  }

  move(state: any) {
    this.socketService.move(state);
  }
}
