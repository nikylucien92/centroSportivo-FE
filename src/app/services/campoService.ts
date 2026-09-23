import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { CampoDto} from '../models/prenotazioneRequest.model';

@Injectable({
  providedIn: 'root',
})
export class CampoService {
  private url = 'http://localhost:8080/campo';

  private httpClient = inject(HttpClient);

  // =====================================================
  // TUTTI I CAMPI
  // =====================================================

  getAll(): Observable<CampoDto[]> {
    return this.httpClient.get<CampoDto[]>(this.url + '/getall');
  }

  // =====================================================
  // CAMPI PER TIPOLOGIA (es. "Padel", "Calcio a 5")
  // =====================================================

  getByTipologia(tipologia: string): Observable<CampoDto[]> {
    return this.httpClient.get<CampoDto[]>(
      this.url + '/tipologia/' + encodeURIComponent(tipologia)
    );
  }
}
