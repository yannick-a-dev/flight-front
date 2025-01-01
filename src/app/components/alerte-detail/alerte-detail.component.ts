import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../services/alert.service';
import { Alert } from '../../model/alert';

@Component({
  selector: 'app-alerte-detail',
  standalone: false,
  
  templateUrl: './alerte-detail.component.html',
  styleUrl: './alerte-detail.component.scss'
})
export class AlerteDetailComponent implements OnInit {
  alertDetails: Alert | null = null;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private alertService: AlertService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const alertId = +this.route.snapshot.paramMap.get('id')!; // Récupérer l'ID de l'alerte depuis l'URL
    if (alertId) {
      this.getAlertDetails(alertId);  // Appeler la méthode pour récupérer les détails de l'alerte
    }
  }

  /**
   * Récupère les détails d'une alerte.
   * @param alertId L'identifiant de l'alerte.
   */
  getAlertDetails(alertId: number): void {
    this.alertService.getAlertById(alertId).subscribe(
      (data) => {
        this.alertDetails = data;  // Mettre à jour les détails de l'alerte
        this.errorMessage = null;  // Réinitialiser le message d'erreur
      },
      (error) => {
        this.errorMessage = 'Erreur lors du chargement des détails de l\'alerte.';
        console.error(error);
      }
    );
  }

  /**
   * Retourner à la liste des alertes.
   */
  goBack(): void {
    this.router.navigate(['/alert-list']);  // Rediriger vers la liste des alertes
  }
}
