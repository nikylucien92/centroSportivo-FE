import {Component, OnInit, signal } from '@angular/core';
import {Login} from '../login/login';
import { Cards } from '../cards/cards';
import { CarouselMatch } from '../carousel-match/carousel-match';
import { Navbar } from '../navbar/navbar';
import { Auth } from '../services/auth';
import { Registrazione } from '../registrazione/registrazione';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Cards, CarouselMatch, Navbar, Login, Registrazione],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {


  nomeUtente: string | null = null;
  autenticato=false;
  schermataAuth : 'login' | 'registrazione'='login';

  mostraToasts=signal(false);
  toastsTitolo=signal('');
  toastsMessaggio=signal('');
  private toastTimer?: ReturnType<typeof setTimeout>;


  constructor(private auth: Auth) {}

  ngOnInit(): void {
    // Controlliamo subito se esiste
    // una sessione salvata nel localStorage
    this.autenticato = this.auth.isLoggedIn();

    // Recuperiamo il nome dell'utente
    this.auth.nomeUtente$.subscribe((nome) => {
      this.nomeUtente = nome;

      // Se il nome esiste consideriamo
      // l'utente autenticato
      this.autenticato = nome !== null;

    });
  }

    mostraNotifica(titolo: string, messaggio: string): void {

      this.toastsTitolo.set(titolo);
      this.toastsMessaggio.set(messaggio);
      this.mostraToasts.set(true);
      clearTimeout(this.toastTimer);

      this.toastTimer= setTimeout(() => {
        console.log('toast partito');
      
        this.mostraToasts.set(false);
        console.log('toast chiuso' , this.mostraToasts());
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
    this.mostraNotifica('--Login--',
      'Login effettuato con successo'
    );

  }

  registrazioneCompletata(): void {

      this.mostraNotifica('---Registrazione completata--- ',
        'Hai effettuato con successo la registrazione');
       
  }

  chiudiToast():void{
    clearTimeout(this.toastTimer);
    this.mostraToasts.set(false);
  }

  ngOnDestroy(): void {
    clearTimeout(this.toastTimer);
  }

}
