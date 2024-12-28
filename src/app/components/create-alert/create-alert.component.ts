import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Alert } from '../../model/alert';
import { Router } from '@angular/router';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-create-alert',
  standalone: false,
  
  templateUrl: './create-alert.component.html',
  styleUrl: './create-alert.component.scss'
})
export class CreateAlertComponent {
  alertForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private router: Router
  ) {
    // Initialisation du formulaire avec les validations
    this.alertForm = this.formBuilder.group({
      message: ['', [Validators.required, Validators.maxLength(255)]],
      severity: ['', [Validators.required]],
      alertDate: ['', [Validators.required]] // Ajoutez alertDate ici
    });
  }

  // Méthode pour soumettre le formulaire
  onSubmit(): void {
    if (this.alertForm.invalid) {
      return; // Si le formulaire est invalide, on ne soumet rien
    }
  
    const alertData: Alert = {
      id: 0, // ou tout autre mécanisme d'ID si nécessaire
      message: this.alertForm.value.message,
      alertDate: this.alertForm.value.alertDate,
      severity: this.alertForm.value.severity,
      passengerId: 1, // ou récupérez dynamiquement l'ID du passager
      flightId: 1 // ou récupérez dynamiquement l'ID du vol
    };
  
    this.alertService.createAlert(alertData).subscribe(
      (response) => {
        console.log('Alerte créée avec succès:', response);
        this.router.navigate(['/']); // Rediriger vers la page d'accueil ou tableau de bord
      },
      (error) => {
        console.error('Erreur lors de la création de l\'alerte:', error);
      }
    );
  }
  

  // Accesseurs pour les contrôles de formulaire
  get message() {
    return this.alertForm.get('message');
  }

  get severity() {
    return this.alertForm.get('severity');
  }

  get alertDate() {
    return this.alertForm.get('alertDate');
  }

  // Méthode pour obtenir les messages d'erreur
  getErrorMessage(controlName: string): string {
    const control = this.alertForm.get(controlName);

    if (control?.hasError('required')) {
      return 'Ce champ est requis';
    }
    if (control?.hasError('maxlength')) {
      return `La longueur maximale est de ${control.errors?.['maxlength'].requiredLength} caractères`;
    }

    return '';
  }
}
