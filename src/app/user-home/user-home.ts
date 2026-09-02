import { Component } from '@angular/core';
import { Cards } from '../cards/cards';
import { CarouselMatch } from '../carousel-match/carousel-match';

@Component({
  selector: 'app-user-home',
  imports: [Cards, CarouselMatch],
  templateUrl: './user-home.html',
  styleUrl: './user-home.css',
})
export class UserHome {
  
    //private router:Router ,private authService:Auth
    constructor() {
          console.log('USER HOME CARICATA');

    }
  nomeUtente='';

  ngOnInit(){
    const nome=localStorage.getItem('nomeUtente');
    if(nome)
    {
      this.nomeUtente=nome;

    }
  }

/*
  logout() {
  this.authService.logout();
  this.router.navigate(['/']);
}
*/

}
