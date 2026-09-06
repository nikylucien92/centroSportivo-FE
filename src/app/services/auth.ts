import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { RegisterRequest } from '../models/registerRequest.model';
import { LoginRequest } from '../models/loginRequest';


export interface AuthResponse {
  token: string;
  nome: string;
}


@Injectable({
  providedIn: 'root'
})
export class Auth {

  private url = 'http://localhost:8080/auth';

  private httpClient = inject(HttpClient);


  // =====================================================
  // STATO UTENTE AUTENTICATO
  //crea uno stato condiviso dell'utente autenticato

  private nomeUtenteSubject =new BehaviorSubject<string | null>(localStorage.getItem('nomeUtente')
    );

  nomeUtente$ =
    this.nomeUtenteSubject.asObservable();


  // =====================================================
  // REGISTRAZIONE
  // =====================================================

  register(user: RegisterRequest): Observable<AuthResponse> {

    return this.httpClient.post<AuthResponse>(
      this.url + '/register',
      user
    );

  }


  // =====================================================
  // LOGIN
  // =====================================================

  login(user: LoginRequest): Observable<AuthResponse> {

    return this.httpClient.post<AuthResponse>(
      this.url + '/login',
      user
    );

  }


  // =====================================================
  // CONTROLLO AUTENTICAZIONE
  // =====================================================

  isLoggedIn(): boolean {

    return localStorage.getItem('token') !== null;

  }


  // =====================================================
  // SALVA AUTENTICAZIONE
  // =====================================================

  salvaAutenticazione(
    token: string,
    nomeUtente: string
  ): void {

    localStorage.setItem('token', token);

    localStorage.setItem(
      'nomeUtente',
      nomeUtente
    );

    // Comunica a Navbar e Home
    // che l'utente è autenticato
    this.nomeUtenteSubject.next(nomeUtente);

  }


  // =====================================================
  // LOGOUT
  // =====================================================

  logout(): void {

    localStorage.removeItem('token');

    localStorage.removeItem('nomeUtente');

    this.nomeUtenteSubject.next(null);

  }

}