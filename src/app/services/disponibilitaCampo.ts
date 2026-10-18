import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { DisponibilitaEvent } from '../models/prenotazioneRequest.model';
import { DisponibilitaCampoDto } from '../models/prenotazioneRequest.model';

@Injectable({
  providedIn: 'root',
})
export class DisponibilitaCampoService {
  private url = 'http://localhost:8080/disponibilitaCampo';

  private httpClient = inject(HttpClient);

  // =====================================================
  // SLOT DI UN CAMPO IN UNA DATA SPECIFICA (formato YYYY-MM-DD)
  // =====================================================

  getByCampoEData(idCampo: number, data: string): Observable<DisponibilitaCampoDto[]> {
    return this.httpClient.get<DisponibilitaCampoDto[]>(
      this.url + '/campo/' + idCampo + '/data',
      { params: { data } }
    );
  }

  streamEventi(): Observable<DisponibilitaEvent> {
  return new Observable<DisponibilitaEvent>((subscriber) => {
    const eventSource = new EventSource('http://localhost:8080/disponibilita/stream');

    eventSource.addEventListener('disponibilita', (event: MessageEvent) => {
      subscriber.next(JSON.parse(event.data));
    });

    eventSource.onerror = (err) => {
      // EventSource si riconnette automaticamente da solo quando cade;
      // non propaghiamo errore al subscriber per non interrompere il flusso
      console.warn('SSE: connessione interrotta, riconnessione automatica in corso', err);
    };

    // Funzione di cleanup: chiamata automaticamente quando ci si disiscrive
    return () => eventSource.close();
  });
}
}
