import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class JwtInterceptorInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(
    request: HttpRequest<any>, 
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    
    const authToken: string = sessionStorage.getItem('token') || '';
    if (authToken) {
      const authRequest = request.clone({
        setHeaders: { Authorization: `Bearer ${authToken}` },
      });

      return next.handle(authRequest);
    }

    return next.handle(request);    
  }
}
