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
  errorMessage: string | null = null;

  constructor(private router: Router, private alertService: AlertService) {}

  ngOnInit() {
    this.getAllAlerts(); // Charger toutes les alertes au démarrage
  }

  /**
   * Récupère toutes les alertes disponibles.
   */
getAllAlerts(): void {
  this.alertService.getAllAlerts().subscribe(
    (data) => {
      // Garder uniquement les alertes "créées" (présentes en base)
      const validAlerts = data.filter(alert =>
        alert && alert.id != null && alert.message?.trim()
      );

      this.alerts = validAlerts;

      const removed = data.length - validAlerts.length;
      if (removed > 0) {
        console.warn(`${removed} fausses alertes ignorées`);
      }
    },
    (error) => {
      this.errorMessage = 'Erreur lors du chargement des alertes.';
      console.error(error);
    }
  );
}


  /**
   * Récupère les alertes pour un passager spécifique.
   * @param passengerId 
   */
  getAlertsForPassenger(passengerId: number): void {
    this.alertService.getAlertsForPassenger(passengerId).subscribe(
      (data) => {
        this.alerts = data;
        this.errorMessage = null; 
      },
      (error) => {
        this.errorMessage = `Erreur lors de la récupération des alertes pour le passager ${passengerId}.`;
        console.error(error);
      }
    );
  }

  /**
   * Navigue vers la page de détails d'une alerte spécifique.
   * @param alertId L'identifiant de l'alerte.
   */
  viewAlertDetails(alertId: number): void {
    this.router.navigate([`/alerte-detail/${alertId}`]);
  }
}
