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
    const alertId = +this.route.snapshot.paramMap.get('id')!; 
    if (alertId) {
      this.getAlertDetails(alertId);  
    }
  }

  /**
   * Récupère les détails d'une alerte.
   * @param alertId L'identifiant de l'alerte.
   */
  getAlertDetails(alertId: number): void {
    this.alertService.getAlertById(alertId).subscribe(
      (data) => {
        this.alertDetails = data; 
        this.errorMessage = null;  
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
    this.router.navigate(['/alert-list']);  
  }
}
