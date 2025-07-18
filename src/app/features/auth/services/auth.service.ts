import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { User } from '../models/user.model';
import { LoginResponse } from '../models/login-response.model';
import { LoginRequest } from '../models/login-request.model';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  $user = new BehaviorSubject<User | undefined>(undefined);

  constructor(private http: HttpClient,
    private cookieService: CookieService
  ) { }

  ngOnInit() {
    this.cookieService.set('username', 'Carroll');
    const value = this.cookieService.get('username');
    console.log(value);
  }

  register(request: LoginRequest): Observable<void> {
    return this.http.post<void>(`${environment.accessApiBaseUrl}/api/Auth/register`, {
      email: request.email,
      password: request.password
    });
  }

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.accessApiBaseUrl}/api/Auth/login`, {
      email: request.email,
      password: request.password
    });
  }

  setUser(user: User): void {

    this.$user.next(user);

    localStorage.setItem('user-email', user.email);
    localStorage.setItem('user-roles', user.roles.join(','));

  }

  user(): Observable<User | undefined> {
    return this.$user.asObservable();
  }

  getUser(): User | undefined {
    const email = localStorage.getItem('user-email');
    const roles = localStorage.getItem('user-roles');

    if (email && roles) {
      const user: User = {
        email: email,
        roles: roles?.split(',')
      };

      return user;
    }
    return undefined;
  }

  logout(): void {
    localStorage.clear();
    this.cookieService.delete('Authorization', '/');
    this.$user.next(undefined);
  }

}
