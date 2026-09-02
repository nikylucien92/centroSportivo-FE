import { Component } from '@angular/core';
import {CarouselMatch} from '../carousel-match/carousel-match';
import {Cards} from '../cards/cards';
import { Navbar } from "../navbar/navbar";

@Component({
  selector: 'app-home',
  imports: [Cards, CarouselMatch, Navbar],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

}
