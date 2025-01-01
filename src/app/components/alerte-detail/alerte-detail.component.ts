import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-alerte-detail',
  standalone: false,
  
  templateUrl: './alerte-detail.component.html',
  styleUrl: './alerte-detail.component.scss'
})
export class AlerteDetailComponent implements OnInit {
  alertId: number;
  alertDetails: any;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,        // Pour récupérer l'ID de l'alerte depuis l'URL
    private alertService: AlertService,    // Service pour récupérer les alertes
    private router: Router                 // Pour la navigation si nécessaire
  ) {}

  ngOnInit(): void {
    // Récupérer l'ID de l'alerte depuis l'URL
    this.alertId = Number(this.route.snapshot.paramMap.get('id'));

    // Charger les détails de l'alerte
    this.fetchAlertDetails();
  }

  fetchAlertDetails(): void {
    this.alertService.getAlertById(this.alertId).subscribe({
      next: (alert) => {
        this.alertDetails = alert;
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors de la récupération des détails de l\'alerte';
        console.error(error);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/liste-des-alertes']);
  }
}
