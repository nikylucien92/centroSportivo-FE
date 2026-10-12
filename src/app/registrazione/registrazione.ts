import { Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RegisterRequest } from '../models/registerRequest.model';
import { Auth } from '../services/auth';

@Component({
  selector: 'app-registrazione',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './registrazione.html',
  styleUrl: './registrazione.css',
})
export class Registrazione {
  private auth = inject(Auth);

  user: RegisterRequest = new RegisterRequest();
  messaggioError = signal('');
  loading = signal(false);

  @Output()
  chiudi = new EventEmitter<void>();

  @Output()
  register = new EventEmitter<void>();

  emit(): void {
    this.chiudi.emit();
  }

  private nomeCognomeRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ]{2,20}$/;
  private emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
  private telefonoRegex = /^(?:(?:\+|00)39)?3\d{9}$/;

  formValido(): boolean {
    return (
      this.validaNome() &&
      this.validaCognome() &&
      this.validaEmail() &&
      this.validaTelefono() &&
      this.validaPassword()
    );
  }

  registrati(): void {
    this.loading.set(true);

    if (!this.validaNome()) {
      return;
    }

    // Cognome

    if (!this.validaCognome()) {
      return;
    }

    // Email

    if (!this.validaEmail()) {
      return;
    }

    // Password

    if (!this.validaPassword()) {
      return;
    }

    // Telefono

    if (!this.validaTelefono()) {
      return;
    }

    //chiamata al backend
    this.auth.register(this.user).subscribe({
      next: (res) => {
        console.log('Registrazione effettuata:', res);
        this.auth.salvaAutenticazione(res.token, res.nome, res.idUtente);

        this.loading.set(false);
        this.register.emit();
      },

      error: (err) => {
        console.error('Errore durante registrazione', err);
        if (err.status === 0) {
          this.messaggioError.set('Server non raggiungibile');
        } else {
          this.messaggioError.set(
            err.error?.message ||
              err.error?.messaggio ||
              (typeof err.error === 'string' ? err.error : '') ||
              (err.status === 401 ? 'Credenziali non valide' : 'Errore durante la registrazione'),
          );
        }
        this.loading.set(false);
      },
    });
  }

  validaNome(): boolean {
    if (!this.user.nome) {
      return false;
    }

    return this.nomeCognomeRegex.test(this.user.nome.trim());
  }

  validaCognome(): boolean {
    if (!this.user.cognome) {
      return false;
    }

    return this.nomeCognomeRegex.test(this.user.cognome.trim());
  }

  validaEmail(): boolean {
    if (!this.user.email) {
      return false;
    }

    return this.emailRegex.test(this.user.email.trim());
  }

  validaPassword(): boolean {
    if (!this.user.password) {
      return false;
    }

    return this.passwordRegex.test(this.user.password);
  }

  validaTelefono(): boolean {
    if (!this.user.telefono) {
      return false;
    }
    return this.telefonoRegex.test(this.user.telefono.trim());
  }
}
