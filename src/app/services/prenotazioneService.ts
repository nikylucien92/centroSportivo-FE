import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { PrenotazioneDto } from '../models/prenotazioneRequest.model';

// Corrisponde a org.springframework.data.domain.Page lato backend
// (solo i campi che ci servono nel frontend).
export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

@Injectable({
  providedIn: 'root',
})
export class PrenotazioneService {
  private url = 'http://localhost:8080/prenotazione';

  private httpClient = inject(HttpClient);

  // =====================================================
  // EFFETTUA PRENOTAZIONE
  // POST /prenotazione?utenteId=...
  // =====================================================

  effettuaPrenotazione(
    prenotazione: PrenotazioneDto,
    utenteId: number
  ): Observable<PrenotazioneDto> {
    return this.httpClient.post<PrenotazioneDto>(this.url, prenotazione, {
      params: { utenteId },
    });
  }

  // =====================================================
  // CANCELLA PRENOTAZIONE
  // DELETE /prenotazione/{idUtente}?idPrenotazione=...
  // =====================================================

  cancellaPrenotazione(
    idUtente: number,
    idPrenotazione: number
  ): Observable<PrenotazioneDto[]> {
    return this.httpClient.delete<PrenotazioneDto[]>(this.url + '/' + idUtente, {
      params: { idPrenotazione },
    });
  }

  // =====================================================
  // SPESA TOTALE UTENTE
  // GET /prenotazione/{utenteId}/spesa-totale
  // =====================================================

  spesaTotale(utenteId: number): Observable<number> {
    return this.httpClient.get<number>(this.url + '/' + utenteId + '/spesa-totale');
  }

  // =====================================================
  // LISTA PRENOTAZIONI PAGINATA DI UN UTENTE
  // GET /prenotazione/listaSingoloUtente/{id}?page=&size=
  // =====================================================

  listaSingoloUtente(
    idUtente: number,
    page: number = 0,
    size: number = 10
  ): Observable<Page<PrenotazioneDto>> {
    return this.httpClient.get<Page<PrenotazioneDto>>(
      this.url + '/listaSingoloUtente/' + idUtente,
      { params: { page, size } }
    );
  }

  // =====================================================
  // PRENOTAZIONI PER DATA (formato YYYY-MM-DD)
  // GET /prenotazione/data?data=...
  // =====================================================

  trovaPerData(data: string): Observable<PrenotazioneDto[]> {
    return this.httpClient.get<PrenotazioneDto[]>(this.url + '/data', {
      params: { data },
    });
  }
}
