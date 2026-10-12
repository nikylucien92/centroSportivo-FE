import { Component, EventEmitter, Output, inject,signal} from '@angular/core';
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
  
  private emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
   msgError = signal('');
  loading = signal(false);

   @Output()
  loginSuccess = new EventEmitter<void>();
  @Output()
  registrazione = new EventEmitter<void>();

 
 apriRegistrazione(): void  {
    this.msgError.set('');
    this.registrazione.emit();
  }  


  validaLogin() : boolean{
    return  (
      this.validaEmail() && 
      this.validaPassword()
    );
  }

accedi(): void {

  //Pulitura di eventuali messaggi di errore precedenti
   this.msgError.set('');
   this.loading.set(false);

      //evito richieste duplicate ,esempios:quando l'utente clicca ripetutamente
      //la richiesta , mentre è già incorso
      if (this.loading()) {
        return;
      }

    if (!this.userLogin.email?.trim()) {
      this.msgError.set('Inserisci la tua email per accedere');
      return;
    }

    if (!this.validaEmail()) {
      this.msgError.set('Inserisci un formato email valido');
      return;
    }


    if (!this.userLogin.password) {
      this.msgError.set('Inserisci la tua password per accedere');
      return;
    }

    if (!this.validaPassword()) {
      this.msgError.set('La password deve contenere almeno 6 caratteri');
      return;
    }


    // Chiamata al backend
    this.auth.login(this.userLogin).subscribe({
      next: (res) => {
        
        console.log('Login effettuato con successo', res);
        this.auth.salvaAutenticazione(res.token, res.nome, res.idUtente);

        //RICHIESTA TERMINATA DAL BACKEND , quindi il btn torna cliccabile
        this.loading.set(false);
        this.loginSuccess.emit();
      },
      error: (err) => {
        console.error('HTTP status:', err.status);
     
        //oppure : this.msgError =err.error?.message;
        //this.msgError =err.error?.message ?? 'Errore durante il login';

        if(err.status===0)
          {
            this.msgError.set('Server non raggiungibile');
          }
          else {
          this.msgError.set(
            err.error?.message ||
            err.error?.messaggio ||
            (typeof err.error === 'string' ? err.error : '') ||
            (err.status === 401 ? 'Credenziali non valide' : 'Errore durante il login')
          );
        }
        this.loading.set(false);
      }
      
    });
  }


  validaEmail(): boolean {
    if (!this.userLogin.email) {
      return false;
    }

    return this.emailRegex.test(this.userLogin.email.trim());
  }

  validaPassword():boolean{
    if(!this.userLogin.password)
    {
      return false;
    }
    return this.userLogin.password.length >6;

  }


}
