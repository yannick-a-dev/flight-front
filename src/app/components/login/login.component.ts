import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TokenResponse } from '../../model/TokenResponse';

@Component({
  selector: 'app-login',
  standalone: false,
  
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit{
  loginForm!: FormGroup;
  isOtpStep = false;
  errorMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      otp: ['']
    });
  }

onSubmit(): void {
  this.errorMessage = '';

  // Vérifier la validité du formulaire
  if (!this.loginForm.valid) {
    this.errorMessage = 'Veuillez remplir tous les champs requis';
    return;
  }

  const { username, password, otp } = this.loginForm.value;

  if (!this.isOtpStep) {
    // Étape 1 : login classique -> envoi OTP
    this.authService.login(username, password).subscribe({
      next: (response) => {
        console.log('OTP envoyé:', response);
        this.isOtpStep = true;
        this.errorMessage = 'Un code OTP a été envoyé à votre email.';

        // Rendre le champ OTP obligatoire pour la prochaine étape
        this.loginForm.get('otp')?.setValidators([Validators.required]);
        this.loginForm.get('otp')?.updateValueAndValidity();
      },
      error: (err) => {
        this.errorMessage = 'Identifiants invalides, veuillez réessayer';
        console.error('Login error:', err);
      }
    });
  } else {
    // Étape 2 : vérification OTP
    if (!otp || otp.trim() === '') {
      this.errorMessage = 'Veuillez entrer le code OTP';
      return;
    }

    this.authService.verifyOtp(username, otp).subscribe({
      next: (response: TokenResponse) => {
        console.log('OTP validé:', response);
       this.authService.loginSuccess(response.accessToken!, response.refreshToken!);
        // Rediriger vers la page d'accueil
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.errorMessage = 'OTP invalide, veuillez réessayer';
        console.error('OTP error:', err);
      }
    });
  }
}


  // Optionnel : méthode pour réinitialiser le formulaire
  resetForm(): void {
    this.loginForm.reset();
    this.isOtpStep = false;
    this.errorMessage = '';
  }
}
