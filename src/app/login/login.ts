import { Component ,inject,Output,EventEmitter} from '@angular/core';
import { Auth } from '../services/auth';
import { RegisterRequest } from '../models/registerRequest.model';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  
  constructor(private router:Router){};

    private auth = inject(Auth);
    user: RegisterRequest = new RegisterRequest();
  
    private emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    private passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

    @Output()
  login = new EventEmitter<void>();

  @Output()
  chiudi = new EventEmitter<void>();


  apriRegistrazione(): void {
    this.login.emit();
  }

  chiudiLogin(): void {
    this.chiudi.emit();
  }

 // ==========================================
  // VALIDAZIONE EMAIL
  // ==========================================

  validaEmail(): boolean {
    if (!this.user.email) {
      return false;
    }

    return this.emailRegex.test(this.user.email.trim());
  }

  // ==========================================
  // VALIDAZIONE PASSWORD
  // ==========================================

  validaPassword(): boolean {
    if (!this.user.password) {
      return false;
    }

    return this.passwordRegex.test(this.user.password);
  }


    accedi(): void {
   
    if (!this.validaEmail()) {
      return;
    }

    if (!this.validaPassword()) {
      return;
    }
   
    this.auth.register(this.user).subscribe({
      next: (res) => {

       // Salvo il nome dell'utente
      localStorage.setItem('nomeUtente', this.user.nome);

     
      // Chiudo la modal
      this.chiudiLogin();

      // Dopo 2 secondi vado alla nuova pagina
      setTimeout(() => {
        this.router.navigate(['/user-home']);
        },2000);
      },
      error: (err) => {
        console.error('Errore durante la registrazione:', err);
      },
    });
  }

 

}
