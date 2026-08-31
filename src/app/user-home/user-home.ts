import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../services/auth';
@Component({
  selector: 'app-user-home',
  imports: [],
  templateUrl: './user-home.html',
  styleUrl: './user-home.css',
})
export class UserHome {
  
    constructor(private router:Router ,private authService:Auth) {}
  nomeUtente='';

  ngOnInit(){
    const nome=localStorage.getItem('nomeUtente');
    if(nome)
    {
      this.nomeUtente=nome;

    }
  }


}
