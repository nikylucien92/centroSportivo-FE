import { Component } from '@angular/core';
import { PrenotazioneModal } from '../prenotazione-modal/prenotazione-modal';

@Component({
  selector: 'app-cards',
  imports: [PrenotazioneModal],
  standalone: true,
  templateUrl: './cards.html',
  styleUrl: './cards.css',
})
export class Cards {
  mostraPrenotazione = false;

  sportSelezionato = '';

  apriPrenotazione(sport: string): void {
    this.sportSelezionato = sport;

    this.mostraPrenotazione = true;
  }

  chiudiPrenotazione(): void {
    this.mostraPrenotazione = false;
  }

  prenotazioneCompletata(): void {
    this.mostraPrenotazione = false;

    alert('Prenotazione effettuata con successo!');
  }
}
