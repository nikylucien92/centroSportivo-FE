import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Auth } from '../services/auth';

// Interceptor funzionale (stile Angular 17+): aggiunge automaticamente
// l'header "Authorization: Bearer <token>" a ogni richiesta, se un
// token è presente in localStorage. Le chiamate a /auth/** (login,
// registrazione) funzionano comunque: il backend le rende pubbliche,
// quindi non serve escluderle esplicitamente qui.
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(Auth);
  const token = auth.getToken();

  if (!token) {
    return next(req);
  }

  const reqConToken = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return next(reqConToken);
};
