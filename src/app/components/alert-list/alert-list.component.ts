import { Component, Input, OnInit } from '@angular/core';
import { Alert } from '../../model/alert';
import { Router } from '@angular/router';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-alert-list',
  standalone: false,
  
  templateUrl: './alert-list.component.html',
  styleUrl: './alert-list.component.scss'
})
export class AlertListComponent implements OnInit{

  alerts: Alert[] = [];
  
 // @Input() alerts: Alert[] = [];  // Liste des alertes passée en entrée

  constructor(private router: Router, private alertService: AlertService) {}

  ngOnInit() {
    this.getAlerts();  // Charger les alertes dès le début
  }

  getAlerts(): void {
    this.alertService.getAllAlerts().subscribe(
      (data) => {
        this.alerts = data;  // Mettre à jour la liste des alertes
      },
      (error) => {
        console.error('Erreur lors du chargement des alertes', error);
      }
    );
  }

  // Méthode pour rediriger vers les détails d'une alerte
  viewAlertDetails(alertId: number): void {
    this.router.navigate(['/alert-details', alertId]);
  }
}
