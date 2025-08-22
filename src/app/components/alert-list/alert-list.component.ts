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
export class AlertListComponent implements OnInit {

  validAlerts: Alert[] = []; 
  errorMessage: string | null = null;

  constructor(private router: Router, private alertService: AlertService) { }

  ngOnInit() {
    this.getAllAlerts(); 
  }

  /**
   * Récupère toutes les alertes disponibles.
   */

getAllAlerts(): void {
  console.log('⏳ Chargement des alertes depuis le backend...');
  
  this.alertService.getAllAlerts().subscribe(
    (data) => {
      console.log('📦 Données brutes reçues du service :', data);

      this.validAlerts = data;
      console.log('✅ Données assignées à validAlerts :', this.validAlerts);

      this.validAlerts = this.validAlerts.filter(a => a.id != null);
      console.log('🔍 Après filtrage (alerts avec id != null) :', this.validAlerts);

      if (this.validAlerts.length === 0) {
        console.warn('⚠️ Aucune alerte valide trouvée ! Vérifie la correspondance des champs backend ↔ frontend.');
      }
    },
    (error) => {
      this.errorMessage = 'Erreur lors du chargement des alertes.';
      console.error('❌ Erreur lors de l’appel API :', error);
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
        this.validAlerts = data;
        this.validAlerts = this.validAlerts.filter(a => a.id != null); // plus de map ici
        this.errorMessage = null;
        console.log(`Alertes valides pour le passager ${passengerId} :`, this.validAlerts);
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
    if (alertId != null) {
      this.router.navigate([`/alerte-detail/${alertId}`]);
    } else {
      console.warn('Impossible de naviguer : alertId est null ou undefined');
    }
  }

  getSeverityLabel(severity: number | string): string {
    if (typeof severity === 'number') {
      switch (severity) {
        case 0: return 'LOW';
        case 1: return 'MEDIUM';
        case 2: return 'HIGH';
        case 3: return 'CRITICAL';
        default: return 'UNKNOWN';
      }
    }
    return severity; // si c’est déjà une string
  }

}
