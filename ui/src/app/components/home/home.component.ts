import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Form } from '@angular/forms';
import { SocketService } from '../../socket.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  form!: FormGroup;
  joinGame!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private socketService: SocketService,
    private router: Router
  ) {}

  ngOnInit() {
    this.socketService.leaveLobby();
    this.form = this.fb.group({});
    this.joinGame = this.fb.group({
      lobbyId: new FormControl(''),
    });
  }

  onSubmit() {
    // const name = this.form.value.name;
    // localStorage.setItem('name', name);
    this.socketService.createLobby();
  }

  onJoin() {
    const lobbyId = this.joinGame.value.lobbyId;
    this.router.navigate([`/lobby/${lobbyId}`]);
  }
}
