import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Auth } from '../services/auth';
import { Prenotazione } from '../models/prenotazioneRequest';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-prenotazione-modal',
  imports: [DecimalPipe, FormsModule],
  standalone: true,
  templateUrl: './prenotazione-modal.html',
  styleUrl: './prenotazione-modal.css',
})
export class PrenotazioneModal {
  private auth = inject(Auth);

  @Input()
  sport: string = '';

  @Output()
  chiudi = new EventEmitter<void>();

  @Output()
  prenotazioneCompletata = new EventEmitter<void>();

  prenotazione: Prenotazione = {
    sport: '',

    numeroGiocatori: 1,

    costoTotale: 0,

    costoPersona: 0,

    statoPrenotazione: 'NON_CONFERMATA',

    disponibilitaCampo: 'LIBERO',
  };

  ngOnInit(): void {
    this.prenotazione.sport = this.sport;
  }

  calcoloPrezzoPersona(): void {
    if (this.prenotazione.numeroGiocatori > 0 && this.prenotazione.costoTotale > 0) {
      this.prenotazione.costoPersona =
        this.prenotazione.costoTotale / this.prenotazione.numeroGiocatori;
    } else {
      this.prenotazione.costoPersona = 0;
    }
  }

  prenota(): void {
    if (!this.auth.isLoggedIn()) {
      console.log('Devi essere loggato per prenotare');
      return;
    }
    if (this.prenotazione.numeroGiocatori <= 0 || this.prenotazione.costoTotale <= 0) {
      console.log('Numero giocatori e costo totale devono essere maggiori di 0');
      return;
    }

    this.prenotazione.statoPrenotazione = 'CONFERMATA';
    this.prenotazione.disponibilitaCampo = 'PRENOTATO';

    console.log('Prenotazione effettuata con successo', this.prenotazione);

    this.prenotazioneCompletata.emit();
  }

  chiudiModal(): void {
    this.chiudi.emit();
  }
}
