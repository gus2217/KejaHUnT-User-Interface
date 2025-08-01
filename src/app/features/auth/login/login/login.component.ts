import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginRequest } from '../../models/login-request.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  isLoginMode = true;

  loginModel: LoginRequest = {
    email: '',
    password: ''
  };

  registerModel: LoginRequest = {
    email: '',
    password: ''
  };

  returnUrl: string = '/';

  constructor(
    private authService: AuthService,
    private cookieService: CookieService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Detect login/register mode from URL
    this.route.url.subscribe(segments => {
      const currentPath = segments.map(s => s.path).join('/');
      this.isLoginMode = currentPath === 'signin';

      // Get returnUrl from query params
      this.route.queryParams.subscribe(params => {
        this.returnUrl = params['returnUrl'] || '/';
      });
    });
  }

  get model(): LoginRequest {
    return this.isLoginMode ? this.loginModel : this.registerModel;
  }

  toggleMode(): void {
    this.isLoginMode = !this.isLoginMode;
    const targetRoute = this.isLoginMode ? '/signin' : '/register';
    this.router.navigate([targetRoute], {
      queryParams: { returnUrl: this.returnUrl }
    });
  }

  onLoginSubmit(): void {
    this.authService.login(this.loginModel).subscribe({
      next: (response) => {
        console.log('Login success:', response);

        this.cookieService.set(
          'Authorization',
          response.token,
          undefined,
          '/',
          undefined,
          true,
          'Strict'
        );

        // This is already called inside AuthService.login() tap()
        this.router.navigateByUrl(this.returnUrl);
      },
      error: (err) => {
        console.error('Login failed:', err);
        alert('Invalid credentials. Please try again.');
      }
    });
  }

  onRegisterSubmit(): void {
    this.authService.register(this.registerModel).subscribe({
      next: () => {
        alert('Registration successful! You can now log in.');
        this.isLoginMode = true;
        this.router.navigate(['/signin'], {
          queryParams: { returnUrl: this.returnUrl }
        });
      },
      error: (err) => {
        console.error('Registration failed:', err);
        alert('Failed to register. Please try again.');
      }
    });
  }
}
