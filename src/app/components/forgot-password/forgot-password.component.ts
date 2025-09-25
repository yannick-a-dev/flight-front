import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: false,

  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  successMessage = '';
  errorMessage = '';

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.forgotPasswordForm.valid) {
      const email = this.forgotPasswordForm.value.email;

      // Appel réel du service backend
      this.authService.forgotPassword(email).subscribe({
        next: (res) => {
          this.successMessage = res.message || 'Un lien de réinitialisation a été envoyé à votre adresse email.';
          this.errorMessage = '';
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Erreur lors de l’envoi du mail.';
          this.successMessage = '';
        }
      });

    } else {
      this.errorMessage = 'Veuillez entrer un email valide.';
      this.successMessage = '';
    }
  }
}
