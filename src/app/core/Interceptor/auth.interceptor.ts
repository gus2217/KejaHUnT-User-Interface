import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private cookieService: CookieService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (this.shouldInterceptRequest(request)) {
      const token = this.cookieService.get('Authorization');

      if (token) {
        const authRequest = request.clone({
          setHeaders: {
            'Authorization': `Bearer ${token}`
          }
        });
        return next.handle(authRequest);
      }
    }

    return next.handle(request);
  }

  private shouldInterceptRequest(request: HttpRequest<any>): boolean {
    return request.urlWithParams.includes('addAuth=true');
  }
}
