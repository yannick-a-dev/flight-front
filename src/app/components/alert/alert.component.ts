import { Component, OnInit } from '@angular/core';
import { Alert } from '../../model/alert';
import { AlertService } from '../../services/alert.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Passenger } from '../../model/model';
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
  passenger: Passenger | null = null;  // Passager récupéré pour pré-remplir le formulaire

  constructor(
    private alertService: AlertService,
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private passengerService: PassengerService
  ) {
    this.alertForm = this.fb.group({
      passengerId: ['', Validators.required],
      flightId: ['', Validators.required],
      alertDate: ['', Validators.required],
      message: ['', [Validators.required, Validators.maxLength(255)]],
      severity: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    // Récupérer l'ID du passager depuis la route si disponible
    const passengerId = this.activatedRoute.snapshot.paramMap.get('id') || this.activatedRoute.snapshot.queryParamMap.get('id');

    // Vérifier si l'ID est défini, le convertir en number et récupérer les informations du passager
    if (passengerId) {
      const passengerIdNumber = Number(passengerId);  // Conversion en nombre

      if (!isNaN(passengerIdNumber)) {
        // Si la conversion réussit, récupérer les informations du passager
        this.passengerService.getPassengerById(passengerIdNumber).subscribe({
          next: (data) => {
            this.passenger = data;
            // Prérémplir le formulaire avec les informations du passager
            this.alertForm.patchValue({
              passengerId: this.passenger?.id
            });
          },
          error: (err) => {
            console.error('Erreur lors de la récupération du passager:', err);
          }
        });
      } else {
        console.error('L\'ID du passager n\'est pas valide');
      }
    }

    // Charger les alertes existantes
    this.loadAlerts();
  }

  loadAlerts(): void {
    this.alertService.getAllAlerts().subscribe({
      next: (data) => {
        this.alerts = data;
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors de la récupération des alertes';
        console.error(error);
      },
    });
  }

  // Crée une nouvelle alerte et redirige vers la liste des alertes
  createAlert(): void {
    if (this.alertForm.valid) {
      const alert = this.alertForm.value;
      this.alertService.createAlert(alert).subscribe(
        (response) => {
          // Redirection vers la page de la liste des alertes
          this.router.navigate(['/liste-des-alertes']);
        },
        (error) => {
          this.errorMessage = 'Erreur lors de la création de l\'alerte';
        }
      );
    }
  }
}
