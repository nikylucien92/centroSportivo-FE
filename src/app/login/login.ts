import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Auth } from '../services/auth';
import { LoginRequest } from '../models/loginRequest';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  private auth = inject(Auth);

  userLogin: LoginRequest = {
    email: '',
    password: '',
  };

   @Output()
  loginSuccess = new EventEmitter<void>();

  // APRI REGISTRAZIONE
  @Output()
  registrazione = new EventEmitter<void>();

 
 apriRegistrazione(): void {
    this.registrazione.emit();
  }  


accedi(): void {
    // Controllo email

    if (!this.userLogin.email.trim()) {
      console.log('L\'email non può essere vuota');
      return;
    }

    // Controllo password

    if (!this.userLogin.password) {
      console.log('La password non può essere vuota');
      return;
    }

    // Chiamata al backend

    this.auth.login(this.userLogin).subscribe({
      next: (res) => {
        console.log('Login effettuato con successo', res);

        this.auth.salvaAutenticazione(res.token, res.nome);
        this.loginSuccess.emit();
      },

      error: (err) => {
        console.error('Errore durante il login:', err);
      },
    });
  }


}
