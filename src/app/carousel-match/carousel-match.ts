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

scrollCards(direction: 'avanti' | 'indietro' ='avanti'): void {
  const offset=direction=== 'avanti' ? 322 : -322;
  this.cardsWrapper.nativeElement.scrollBy({

    left: offset,
    behavior: 'smooth'

  });

}

}
