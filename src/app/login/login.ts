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
  
  private emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  msgError:string = "";


   @Output()
  loginSuccess = new EventEmitter<void>();

  // APRI REGISTRAZIONE
  @Output()
  registrazione = new EventEmitter<void>();

 
 apriRegistrazione(): void {
    this.registrazione.emit();
  }  


accedi(): void {

  //Pulitura di eventuali messaggi di errore precedenti
   this.msgError='';

/*se per qualche motivo email fosse undefined 
(es. prima che l'utente scriva qualcosa, a seconda
 di come inizializzi LoginRequest), questo va in crash prima
  ancora di arrivare al controllo.
 Meglio this.userLogin.email?.trim() con optional chaining*/

    if (!this.userLogin.email?.trim()) {
      this.msgError = 'INSERISCI LA TUA EMAIL PER ACCEDERE ';
      return;
    }

    if (!this.validaEmail()) {
      this.msgError = 'Inserisci un formato email valido.';
      return;
    }


    if (!this.userLogin.password) {
      this.msgError = 'INSERISCI LA TUA PASSWORD PER ACCEDERE ';
      return;
    }

    if (!this.validaPassword()) {
      this.msgError = 'La password deve contenere almeno 6 caratteri.';
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
        
        this.msgError = '--Email o password non corretti';
        console.log('ERRORE LOGIN FRONTEND');
        console.log('STATUS:', err.status);
       
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
    return this.userLogin.password.length >5;

  }


}
