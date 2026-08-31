import { Component } from '@angular/core';
import { ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-carousel-match',
  imports: [],
  templateUrl: './carousel-match.html',
  styleUrl: './carousel-match.css',
})
export class CarouselMatch {

  @ViewChild('cardsWrapper')
cardsWrapper!: ElementRef<HTMLDivElement>;

scrollCards(): void {

  this.cardsWrapper.nativeElement.scrollBy({

    left: 322,

    behavior: 'smooth'

  });

}

}
