import { Component, EventEmitter, Output, inject} from '@angular/core';
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

  userLogin: LoginRequest = new LoginRequest();
  
  private emailRegex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

      return;
    }

    // Controllo password

    if (!this.userLogin.password) {

      return;
    }

    // Chiamata al backend

    this.auth.login(this.userLogin).subscribe({
      next: (res) => {
        console.log('Login effettuato con successo', res);

        this.auth.salvaAutenticazione(res.token, res.nome, res.idUtente);
        this.loginSuccess.emit();
      },

      error: (err) => {
        console.error('Errore durante il login:', err);
      },
    });
  }

  
  validaEmail(): boolean {
    if (!this.userLogin.email) {
      return false;
    }

    return this.emailRegex.test(this.userLogin.email.trim());
  }


}
