import { Component, OnInit } from '@angular/core';
import { Alert } from '../../model/alert';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-alert',
  standalone: false,
  
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss'
})
export class AlertsComponent implements OnInit {
  alerts: Alert[] = [];
  passengerId = 1; 
  showAllAlerts = false; 

  constructor(private alertService: AlertService) {}

  ngOnInit(): void {
    this.loadAlerts(); 
  }

  loadAlerts(): void {
    if (this.showAllAlerts) {
      this.alertService.getAllAlerts().subscribe({
        next: (data) => {
          this.alerts = data; 
        },
        error: (err) => {
          console.error('Erreur lors de la récupération des alertes:', err); 
        },
      });
    } else {
      this.alertService.getAlertsForPassenger(this.passengerId).subscribe({
        next: (data) => {
          this.alerts = data; 
        },
        error: (err) => {
          console.error('Erreur lors de la récupération des alertes du passager:', err);
        },
      });
    }
  }

  toggleAlerts(): void {
    this.showAllAlerts = !this.showAllAlerts; 
    this.loadAlerts(); 
  }
}