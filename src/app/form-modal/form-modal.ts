import { Component ,inject,EventEmitter, Output} from '@angular/core';
import { RegisterRequest } from '../models/registerRequest.model';
import { Auth } from '../services/auth';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-modal',
  imports: [FormsModule],
  templateUrl: './form-modal.html',
  styleUrl: './form-modal.css',
})
export class FormModal {
    constructor(private router:Router){}

    @Output() chiudi = new EventEmitter<void>();

  private auth = inject(Auth);

  modalRegister = false;

  messaggioConferma: string | null = null; // Variabile per mostrare il messaggio nella navbar

  user: RegisterRequest = new RegisterRequest();

  private nomeCognomeRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ]{2,20}$/;

  private emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  private passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

  private telefonoRegex = /^(?:(?:\+|00)39)?3\d{9}$/;


  apriRegistrazione(): void {
    this.modalRegister = true;
  }
  chiudiRegistrazione(): void {
    this.chiudi.emit();
  }

  registrati(): void {
    if (!this.validaNome()) {
      //RETURN interrompe immediatamente l'esecuzione di registrati()
      return;
    }

    if (!this.validaCognome()) {
      return;
    }

    if (!this.validaEmail()) {
      return;
    }

    if (!this.validaPassword()) {
      return;
    }
    if (!this.validaTelefono()) {
      return;
    }
    this.auth.register(this.user).subscribe({
      next: (res) => {

       // Salvo il nome dell'utente
      localStorage.setItem('nomeUtente', this.user.nome);

      // Mostro il banner verde
      this.messaggioConferma =
        'Registrazione effettuata con successo';

      // Chiudo la modal
      this.chiudiRegistrazione();

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




  // ==========================================
  // VALIDAZIONE NOME
  // ==========================================

  validaNome(): boolean {
    if (!this.user.nome) {
      return false;
    }

    return this.nomeCognomeRegex.test(this.user.nome.trim());
  }

  // ==========================================
  // VALIDAZIONE COGNOME
  // ==========================================

  validaCognome(): boolean {
    if (!this.user.cognome) {
      return false;
    }

    return this.nomeCognomeRegex.test(this.user.cognome.trim());
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

  // ==========================================
  // VALIDAZIONE TELEFONO
  // ==========================================

  validaTelefono(): boolean {
    if (!this.user.telefono) {
      return false;
    }

    return this.telefonoRegex.test(this.user.telefono.trim());
  }
}
