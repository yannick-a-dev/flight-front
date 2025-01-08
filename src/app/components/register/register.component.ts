import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PassengerService } from '../../services/passenger.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: false,
  
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  passenger = {
    email: '',
    firstName: '',
    lastName: '',
    passportNumber: '',
    phone: '',
    dob: '',
    password: '',
  };
  confirmPassword = '';
  errorMessage = '';
  successMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onRegister(): void {
    if (!this.passenger.email || !this.passenger.firstName || !this.passenger.lastName || !this.passenger.password || !this.confirmPassword) {
      this.errorMessage = 'All fields are required.';
      return;
    }
  
    if (this.passenger.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }
  
    // Proceed with registration
    this.authService.register(this.passenger).subscribe({
      next: () => {
        this.successMessage = 'Registration successful!';
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.errorMessage = error.error.message || 'Registration failed.';
      },
    });
  }
  
}
