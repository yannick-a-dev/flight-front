import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: false,
  
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent implements OnInit{
resetForm: FormGroup;
  token: string = '';
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    this.resetForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    // Récupération du token dans l'URL : /reset-password?token=...
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
  }

  onSubmit() {
    if (this.resetForm.valid && this.token) {
      const newPassword = this.resetForm.value.newPassword;

      this.authService.resetPassword(this.token, newPassword).subscribe({
        next: (res) => {
          this.successMessage = res.message || 'Mot de passe réinitialisé avec succès';
          this.errorMessage = '';
          // Redirection vers login après 3s
          setTimeout(() => this.router.navigate(['/login']), 3000);
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Erreur lors de la réinitialisation';
          this.successMessage = '';
        }
      });
    }
  }
}
