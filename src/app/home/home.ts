import {Component, OnInit } from '@angular/core';
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


  apriRegistrazione(): void {

    this.schermataAuth = 'registrazione';

  }


  apriLogin(): void {

    this.schermataAuth = 'login';

  }

  loginCompletato(): void {

    this.autenticato = true;

  }

  registrazioneCompletata(): void {

    this.autenticato = true;

  }



}
