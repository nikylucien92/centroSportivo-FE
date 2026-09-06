import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';

import { Login } from '../login/login';
import { Registrazione } from '../registrazione/registrazione';
import { Auth } from '../services/auth';

@Component({
  selector: 'app-navbar',
  standalone: true,

  imports: [CommonModule, Login, Registrazione],

  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  nomeUtente: string | null = null;

  activeModal: 'none' | 'login' | 'register' = 'none';

  mostraDropdown = false;

  constructor(private auth: Auth) {}

  ngOnInit(): void {
    this.auth.nomeUtente$.subscribe((nome) => {
      this.nomeUtente = nome;
    });
  }

  openLogin(): void {
    this.activeModal = 'login';
  }

  openRegister(): void {
    this.activeModal = 'register';
  }

  closeAll(): void {
    this.activeModal = 'none';
  }

  loginCompletato(): void {
    this.activeModal = 'none';

    this.mostraDropdown = false;
  }

  registrazioneCompletata(): void {
    this.activeModal = 'none';

    this.mostraDropdown = false;
  }

  apriDropdown(): void {
    this.mostraDropdown = !this.mostraDropdown;
  }

  logout(): void {
    this.auth.logout();

    this.mostraDropdown = false;
  }
}
