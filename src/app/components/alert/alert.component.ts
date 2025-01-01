import { Component, OnInit } from '@angular/core';
import { Alert } from '../../model/alert';
import { AlertService } from '../../services/alert.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

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

  constructor(
    private alertService: AlertService,
    private fb: FormBuilder,
    private router: Router
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
    this.loadAlerts();
  }

  // Charge toutes les alertes depuis le service
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