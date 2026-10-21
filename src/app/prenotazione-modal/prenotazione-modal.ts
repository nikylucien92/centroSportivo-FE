import { Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Auth } from '../services/auth';
import { CampoService } from '../services/campoService';
import { DisponibilitaCampoService } from '../services/disponibilitaCampo';
import { PrenotazioneService } from '../services/prenotazioneService';
import {
  PrenotazioneDto,
  CampoDto,
  DisponibilitaCampoDto,
} from '../models/prenotazioneRequest.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-prenotazione-modal',
  imports: [DecimalPipe, FormsModule],
  standalone: true,
  templateUrl: './prenotazione-modal.html',
  styleUrl: './prenotazione-modal.css',
})
export class PrenotazioneModal implements OnInit, OnDestroy {
  private auth = inject(Auth);
  private campoService = inject(CampoService);
  private disponibilitaCampoService = inject(DisponibilitaCampoService);
  private prenotazioneService = inject(PrenotazioneService);

  // Tipologia del campo (es. "Padel", "Calcio a 5"), passata da cards.ts
  @Input()
  sport: string = '';

  @Output()
  chiudi = new EventEmitter<void>();

  @Output()
  prenotazioneCompletata = new EventEmitter<void>();

  campo: CampoDto | null = null;
  slotDisponibili: DisponibilitaCampoDto[] = [];

  // Data selezionata, formato YYYY-MM-DD (default: oggi)
  dataSelezionata: string = this.getDataOdierna();
  dataMinima:string=this.getDataOdierna();
  
  disponibilitaCampoId: number | null = null;
  numeroGiocatori: number = 1;
  private slotSubscription?: Subscription;
  private sseSubscription?: Subscription;
  caricamento = false;
  invioInCorso = false;
  messaggioErrore = '';

  costoTotale: number = 0;
  costoPersona: number = 0;

  ngOnInit(): void {
    this.caricaCampoEDisponibilita();

    // Ascolta in tempo reale i cambi di disponibilità (es. un altro
    // utente che prenota/cancella mentre questa modale è aperta) e,
    // se riguardano il campo e la data che si sta guardando ora,
    // ricarica la lista degli slot
  }
  ngOnDestroy(): void {
    //Così chiudi anche la sottoscrizione usata
    // per caricare gli slot quando la modal viene distrutta.
    this.slotSubscription?.unsubscribe();
    this.sseSubscription?.unsubscribe();
  }

  private getDataOdierna(): string {
    const today = new Date();

    const anno = today.getFullYear();
    const mese = String(today.getMonth() + 1).padStart(2, '0');
    const giorno = String(today.getDate()).padStart(2, '0');

    return `${anno}-${mese}-${giorno}`;
  }

  // CARICAMENTO CAMPO + SLOT DISPONIBILI

  caricaCampoEDisponibilita(): void {
    this.messaggioErrore = '';
    this.caricamento = true;
    this.slotDisponibili = [];
    this.disponibilitaCampoId = null;

    this.campoService.getByTipologia(this.sport).subscribe({
      next: (campi) => {
        if (campi.length === 0) {
          this.messaggioErrore = 'Nessun campo trovato per questo sport';
          this.caricamento = false;
          return;
        }

        this.campo = campi[0];
        this.costoTotale = this.campo.prezzo;
        this.calcoloPrezzoPersona();

        this.caricaSlot();
      },
      error: () => {
        this.messaggioErrore = 'Errore nel caricamento del campo';
        this.caricamento = false;
      },
    });
  }

  //2 utenti hanno la stessa modale aperta sullo stesso slot. Prima che vinca la richiesta POST /prenotazione (col lock pessimistico), l’altro
  //  utente nel frattempo vede sparire quello slot dalla tendina in tempo reale, invece di scoprirlo solo al momento del click su “Prenota” con un errore secco dal backend.
  
  caricaSlot(): void {
    if (!this.dataSelezionata || !this.campo) {
      return;
    }

  // Annulla l'eventuale richiesta precedente??
  this.slotSubscription?.unsubscribe();

  // Reset della selezione e della lista
  this.slotDisponibili = [];
  this.disponibilitaCampoId = null;
  this.messaggioErrore = '';
  this.caricamento = true;

  this.slotSubscription = this.disponibilitaCampoService
    .getByCampoEData(this.campo.id, this.dataSelezionata)
    .subscribe({
      next: (slot) => {
        this.slotDisponibili = slot.filter(
          s => s.statoDisponibilita === 'DISPONIBILE'
          
        );
        this.caricamento = false;

        console.log('Slot disponibili:', this.slotDisponibili);
      },

      error: (err) => {
        console.error('Errore caricamento slot:', err);

        this.slotDisponibili = [];
        this.disponibilitaCampoId = null;
        this.messaggioErrore =
          'Errore nel caricamento degli orari disponibili';

        this.caricamento = false;
      }
    });
}


  // Richiamato quando l'utente cambia la data nel form
  onCambioData(): void {
    this.disponibilitaCampoId = null;
    this.slotDisponibili = [];
    this.messaggioErrore = '';
    if (!this.dataSelezionata || !this.campo) {
      return;
    }
    this.caricaSlot();
  }

  // CALCOLO COSTO PER PERSONA (solo per anteprima:
  // il valore definitivo arriva dal backend dopo il salvataggio)
  calcoloPrezzoPersona(): void {
    if (this.numeroGiocatori > 0 && this.costoTotale > 0) {
      this.costoPersona = this.costoTotale / this.numeroGiocatori;
    } else {
      this.costoPersona = 0;
    }
  }

  // FORMATTAZIONE ORARIO SLOT PER LA SELECT

  
formattaOrario(slot: DisponibilitaCampoDto): string {
  const formatta = (valore: string): string => {
    // Supporta HH:mm, HH:mm:ss e date ISO con orario
    const match = valore.match(/(?:T)?(\d{2}):(\d{2})/);

    if (match) {
      return `${match[1]}:${match[2]}`;
    }

    return valore;
  };

  return `${formatta(slot.oraInizio)} - ${formatta(slot.oraFine)}`;
}


  // INVIO PRENOTAZIONE

  prenota(): void {
    this.messaggioErrore = '';

    //Controlla se l'utente che sta prenotando , è autenticato o meno
    if (!this.auth.isLoggedIn()) {
      this.messaggioErrore = 'Devi essere loggato per prenotare';
      return;
    }

    const idUtente = this.auth.getIdUtente();

    if (idUtente === null) {
      this.messaggioErrore = 'Utente non riconosciuto, effettua di nuovo il login';
      return;
    }

    if (this.disponibilitaCampoId === null) {
      this.messaggioErrore = 'Seleziona un orario disponibile';
      return;
    }

    if (this.numeroGiocatori <= 0) {
      this.messaggioErrore = 'Il numero di giocatori deve essere maggiore di 0';
      return;
    }

    const nuovaPrenotazione: PrenotazioneDto = {
      numeroGiocatori: this.numeroGiocatori,
      costoTotale: this.costoTotale,
      disponibilitaCampo: { id: this.disponibilitaCampoId },
    };


    this.prenotazioneService.effettuaPrenotazione(nuovaPrenotazione, idUtente).subscribe({
      next: () => {
        this.invioInCorso = false;
        this.prenotazioneCompletata.emit();
      },
      error: (err) => {
        this.invioInCorso = false;
        this.messaggioErrore = err?.error?.message || 'Errore durante la prenotazione, riprova';
      },
    });
  }

  chiudiModal(): void {
    this.chiudi.emit();
  }
}
