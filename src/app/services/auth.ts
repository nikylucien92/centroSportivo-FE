import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { RegisterRequest } from '../models/registerRequest.model';
import { Observable } from 'rxjs';

@Service()
export class Auth {
  private url = 'http://localhost:8080/auth';

  private httpClient = inject(HttpClient);

  register(user: RegisterRequest): Observable<any> {
    return this.httpClient.post(this.url + '/register', user);
  }
}
