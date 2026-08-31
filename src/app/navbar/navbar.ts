import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Login } from '../login/login';
import { Registrazione } from '../registrazione/registrazione';
@Component({
  selector: 'app-navbar',
  imports: [FormsModule , Login,Registrazione],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  

  // Stato corrente: 'none', 'login' o 'register'
  activeModal: 'none' | 'login' | 'register' = 'none';

  openLogin(): void {
    this.activeModal = 'login';
  }

  openRegister(): void {
    this.activeModal = 'register';
  }

  closeAll(): void {
    this.activeModal = 'none';
  }
}
