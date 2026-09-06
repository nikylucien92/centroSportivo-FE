import { Component, OnInit } from '@angular/core';

import { Cards } from '../cards/cards';
import { CarouselMatch } from '../carousel-match/carousel-match';
import { Navbar } from '../navbar/navbar';
import { Auth } from '../services/auth';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Cards, CarouselMatch, Navbar],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  
  nomeUtente: string | null = null;
  constructor(private auth: Auth) {}

  ngOnInit(): void {
    this.auth.nomeUtente$.subscribe((nome) => {
      this.nomeUtente = nome;
    });
  }


}
