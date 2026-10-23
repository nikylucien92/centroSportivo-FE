import { Component, OnInit, signal, OnDestroy } from '@angular/core';
import { Login } from '../login/login';
import { Cards } from '../cards/cards';
import { CarouselMatch } from '../carousel-match/carousel-match';
import { Navbar } from '../navbar/navbar';
import { Auth } from '../services/auth';
import { Registrazione } from '../registrazione/registrazione';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Cards, CarouselMatch, Navbar, Login, Registrazione],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit, OnDestroy {
  nomeUtente: string | null = null;
  autenticato = false;
  schermataAuth: 'login' | 'registrazione' = 'login';

  mostraToasts = signal(false);
  toastsTitolo = signal('');
  toastsMessaggio = signal('');
  private toastTimer?: ReturnType<typeof setTimeout>;
  private notificaSubscription?: Subscription;

  constructor(private auth: Auth) {}

  ngOnInit(): void {
    // Controlliamo subito se esiste
    // una sessione salvata nel localStorage
    this.autenticato = this.auth.isLoggedIn();

    // Recuperiamo il nome dell'utente
    this.auth.nomeUtente$.subscribe((nome) => {
      this.nomeUtente = nome;
      this.autenticato = nome !== null;
    });
    
    // Riceve le notifiche inviate da altri componenti
    this.notificaSubscription = this.auth.notifica$.subscribe(({ titolo, messaggio }) => {
      this.mostraNotifica(titolo, messaggio);
    });
  }
  ngOnDestroy(): void {
    clearTimeout(this.toastTimer);
    this.notificaSubscription?.unsubscribe();

  }

  mostraNotifica(titolo: string, messaggio: string): void {
    this.toastsTitolo.set(titolo);
    this.toastsMessaggio.set(messaggio);
    this.mostraToasts.set(true);

    clearTimeout(this.toastTimer);

    this.toastTimer = setTimeout(() => {
      console.log('toast partito');

      this.mostraToasts.set(false);
    }, 4000);
  }

  apriRegistrazione(): void {
    this.schermataAuth = 'registrazione';
  }

  apriLogin(): void {
    this.schermataAuth = 'login';
  }
  chiudiRegistrazione(): void {
    this.schermataAuth = 'login';
  }

  loginCompletato(): void {
    this.autenticato = true;
    this.auth.inviaNotifica('Login completato','Login effettuato con successo');
  }

  registrazioneCompletata(): void {
    this.auth.inviaNotifica('Registrazione completata','Registrazione effettuata con successo');
  }

  chiudiToast(): void {
    clearTimeout(this.toastTimer);
    this.mostraToasts.set(false);
  }

  
}
