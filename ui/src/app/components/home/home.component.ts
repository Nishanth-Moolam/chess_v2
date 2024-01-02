import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { SocketService } from '../../socket.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private socketService: SocketService,
    private router: Router
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      name: '',
    });
  }

  onSubmit() {
    const name = this.form.value.name;
    localStorage.setItem('name', name);
    this.socketService.createLobby();
  }
}
