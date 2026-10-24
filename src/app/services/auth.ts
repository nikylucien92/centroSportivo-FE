import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable,Subject} from 'rxjs';

import { RegisterRequest } from '../models/registerRequest.model';
import { LoginRequest } from '../models/loginRequest';
import { AuthResponse } from '../models/authResponse';


@Injectable({
  providedIn: 'root'
})
export class Auth {

  private url = 'http://localhost:8080/auth';

  private httpClient = inject(HttpClient);


  // STATO UTENTE AUTENTICATO
  //crea uno stato condiviso dell'utente autenticato

  
  // cosa dichiara?
  private nomeUtenteSubject =new BehaviorSubject<string | null>(localStorage.getItem('nomeUtente'));

  // $ ?
  nomeUtente$ =this.nomeUtenteSubject.asObservable();
  
    private notificaSubject=new Subject < {
      titolo:string,
      messaggio:string
    }>();
    
    notifica$=this.notificaSubject.asObservable();

    inviaNotifica(titolo:string,messaggio:string){
      this.notificaSubject.next({
        titolo,messaggio
      })
        
    }

  // REGISTRAZIONE

  register(user: RegisterRequest): Observable<AuthResponse> {

    return this.httpClient.post<AuthResponse>(
      this.url + '/register',
      user
    );

  }

  // LOGIN

  login(user: LoginRequest): Observable<AuthResponse> {

    return this.httpClient.post<AuthResponse>(
      this.url + '/login',
      user
    );

  }

  // LOGOUT
  logout(): void {

    localStorage.removeItem('token');
    localStorage.removeItem('nomeUtente');
    localStorage.removeItem('idUtente');

    //La Home riceve null e imposta 
    // autenticato = false, tornando alla schermata di login
    this.nomeUtenteSubject.next(null);
  }

  // CONTROLLO AUTENTICAZIONE

  isLoggedIn(): boolean {

    return localStorage.getItem('token') !== null;

  }

  // SALVA AUTENTICAZIONE
  
  salvaAutenticazione(
    token: string,
    nomeUtente: string,
    idUtente: number
  ): void {

    localStorage.setItem('token', token);

    localStorage.setItem(
      'nomeUtente',
      nomeUtente
    );

    localStorage.setItem(
      'idUtente',
      idUtente.toString()
    );

    // Comunica a Navbar e Home
    // che l'utente è autenticato
    this.nomeUtenteSubject.next(nomeUtente);

  }

  // TOKEN E ID UTENTE

  getToken(): string | null {

    return localStorage.getItem('token');

  }

  getIdUtente(): number | null {

    const id = localStorage.getItem('idUtente');

    return id !== null ? Number(id) : null;

  }

}