import { Component } from '@angular/core';
import { FormModal } from '../form-modal/form-modal';

@Component({
  selector: 'app-cards',
  imports: [FormModal],
  templateUrl: './cards.html',
  styleUrl: './cards.css',
})
export class Cards {

  mostraAccessModal:boolean = false;

apriAccessModal(): void {
  this.mostraAccessModal = true;
}

  chiudiAccessModal(): void {

    this.mostraAccessModal = false;

  }

}
