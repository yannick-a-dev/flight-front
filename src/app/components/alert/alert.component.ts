import { Component, OnInit } from '@angular/core';
import { Alert } from '../../model/alert';
import { AlertService } from '../../services/alert.service';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Passenger } from '../../model/passenger';
import { PassengerService } from '../../services/passenger.service';

@Component({
  selector: 'app-alert',
  standalone: false,
  
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss'
})
export class AlertsComponent implements OnInit {
  alerts: Alert[] = [];
  alertForm: FormGroup;
  errorMessage: string | null = null;
  passenger: Passenger | null = null;

  constructor(
    private alertService: AlertService,
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private passengerService: PassengerService
  ) {
    this.alertForm = this.fb.group({
      passengerId: ['', Validators.required],
      flightNumber: ['', Validators.required],
      alertDate: ['', [Validators.required, this.validDateValidator]], 
      message: ['', [Validators.required, Validators.maxLength(200)]],
      severity: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    // Récupérer l'ID du passager depuis les paramètres de route
    this.activatedRoute.paramMap.subscribe((params) => {
      const passengerId = params.get('id');

      if (passengerId) {
        const passengerIdNumber = Number(passengerId);

        if (!isNaN(passengerIdNumber)) {
          this.passengerService.getPassengerById(passengerIdNumber).subscribe({
            next: (data) => {
              this.passenger = data;
              // Préremplir le champ passager dans le formulaire
              this.alertForm.patchValue({ passengerId: data.id });
            },
            error: (err) => this.handleError(err, 'la récupération du passager'),
          });
        } else {
          console.error('L\'ID du passager n\'est pas valide');
        }
      }
    });

    // Charger les alertes existantes
    this.loadAlerts();
  }

  loadAlerts(): void {
    this.alertService.getAllAlerts().subscribe({
      next: (data) => {
        this.alerts = data;
      },
      error: (error) => {
        this.handleError(error, 'la récupération des alertes');
      },
    });
  }

  // Crée une alerte avec conversion de la date en UTC
  createAlert(): void {
    if (this.alertForm.valid) {
      const formData = this.alertForm.value;  // Renommé alert en formData
  
      // Conversion de la date en fuseau horaire UTC
      formData.alertDate = this.convertToUTC(formData.alertDate);
  
      this.alertService.createAlert(formData).subscribe(
        (response) => {
          this.errorMessage = null;
          window.alert('Alerte créée avec succès !');  
          this.router.navigate(['/liste-des-alertes']);
        },
        (error) => {
          this.handleError(error, 'la création de l\'alerte');
        }
      );
    }
  }
  

  // Convertit une date locale en format UTC
  private convertToUTC(localDate: string): string {
    const date = new Date(localDate);
    return date.toISOString(); // Convertit en format ISO 8601 UTC
  }

  // Validateur personnalisé pour vérifier le format de la date
  private validDateValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const isValidDate = !isNaN(Date.parse(value));
    return isValidDate ? null : { invalidDate: true };
  }

  // Gère les erreurs de manière générique
  private handleError(error: any, context: string): void {
    this.errorMessage = `Erreur lors de ${context}. Veuillez réessayer plus tard.`;
    console.error(`[${context}]`, error);
  }
}
