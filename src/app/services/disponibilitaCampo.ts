import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

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
}
