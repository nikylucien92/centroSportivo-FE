import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './navbar/navbar';
import { Cards } from './cards/cards';
import { CarouselMatch } from "./carousel-match/carousel-match"; 
@Component({
  selector: 'app-root',
  imports: [Navbar, Cards, CarouselMatch],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('centroSportivo-FE');

  
    }
