import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Auth } from '../services/auth';
import { CampoService} from '../services/campoService';
import { DisponibilitaCampoService} from '../services/disponibilitaCampo';
import { PrenotazioneService} from '../services/prenotazioneService';
import { PrenotazioneDto,CampoDto,DisponibilitaCampoDto } from '../models/prenotazioneRequest.model';

@Component({
  selector: 'app-prenotazione-modal',
  imports: [DecimalPipe, FormsModule],
  standalone: true,
  templateUrl: './prenotazione-modal.html',
  styleUrl: './prenotazione-modal.css',
})
export class PrenotazioneModal implements OnInit {
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

  // =====================================================
  // STATO
  // =====================================================

  campo: CampoDto | null = null;
  slotDisponibili: DisponibilitaCampoDto[] = [];

  // Data selezionata, formato YYYY-MM-DD (default: oggi)
  dataSelezionata: string = new Date().toISOString().substring(0, 10);

  disponibilitaCampoId: number | null = null;
  numeroGiocatori: number = 1;

  costoTotale: number = 0;
  costoPersona: number = 0;

  caricamento = false;
  invioInCorso = false;
  messaggioErrore: string = '';

  // =====================================================
  // CICLO DI VITA
  // =====================================================

  ngOnInit(): void {
    this.caricaCampoEDisponibilita();
  }

  // =====================================================
  // CARICAMENTO CAMPO + SLOT DISPONIBILI
  // =====================================================

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

  caricaSlot(): void {
    if (!this.campo) {
      return;
    }

    this.caricamento = true;

    this.disponibilitaCampoService
      .getByCampoEData(this.campo.id, this.dataSelezionata)
      .subscribe({
        next: (slot) => {
          // Mostriamo solo gli slot ancora liberi
          this.slotDisponibili = slot.filter(
            (s) => s.statoDisponibilita === 'DISPONIBILE'
          );
          this.caricamento = false;
        },
        error: () => {
          this.messaggioErrore = 'Errore nel caricamento degli orari disponibili';
          this.caricamento = false;
        },
      });
  }

  // Richiamato quando l'utente cambia la data nel form
  onCambioData(): void {
    this.caricaSlot();
  }

  // =====================================================
  // CALCOLO COSTO PER PERSONA (solo per anteprima:
  // il valore definitivo arriva dal backend dopo il salvataggio)
  // =====================================================

  calcoloPrezzoPersona(): void {
    if (this.numeroGiocatori > 0 && this.costoTotale > 0) {
      this.costoPersona = this.costoTotale / this.numeroGiocatori;
    } else {
      this.costoPersona = 0;
    }
  }

  // =====================================================
  // FORMATTAZIONE ORARIO SLOT PER LA SELECT
  // =====================================================

  formattaOrario(slot: DisponibilitaCampoDto): string {
    const inizio = new Date(slot.oraInizio);
    const fine = new Date(slot.oraFine);

    const formato = (d: Date) =>
      d.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });

    return `${formato(inizio)} - ${formato(fine)}`;
  }

  // =====================================================
  // INVIO PRENOTAZIONE
  // =====================================================

  prenota(): void {
    this.messaggioErrore = '';

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

    this.invioInCorso = true;

    this.prenotazioneService
      .effettuaPrenotazione(nuovaPrenotazione, idUtente)
      .subscribe({
        next: () => {
          this.invioInCorso = false;
          this.prenotazioneCompletata.emit();
        },
        error: (err) => {
          this.invioInCorso = false;
          this.messaggioErrore =
            err?.error?.message || 'Errore durante la prenotazione, riprova';
        },
      });
  }

  chiudiModal(): void {
    this.chiudi.emit();
  }
}
