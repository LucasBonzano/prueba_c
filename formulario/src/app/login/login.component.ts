import { Component } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Importa FormsModule para ngModel
import { Router } from '@angular/router';
import { AuthService } from './../services/auth.service';
import { JwtService } from '../services/jwt.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgIf, FormsModule, CommonModule], // Ahora FormsModule en lugar de FormGroup
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  submitted = false;
  isLoggedIn = false;

  constructor(private authService: AuthService, private jwtService: JwtService, private router: Router) {}
  

  onSubmit(): void {
    this.submitted = true;

    if (!this.username || !this.password) return;

    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        this.jwtService.setToken(response.token, response.user);
        this.isLoggedIn = true;
        this.router.navigate(['/list']);
      },
      error: () => {
        this.errorMessage = 'Credenciales inválidas';
      }
    });
  }

  logout(): void {
    this.jwtService.removeToken();
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }
}
