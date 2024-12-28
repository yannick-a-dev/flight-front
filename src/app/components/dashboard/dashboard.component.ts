import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Alert } from '../../model/alert';
import { AlertService } from '../../services/alert.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  user: any = null;

  constructor(private alertService: AlertService, private snackBar: MatSnackBar, private router: Router) {}

  ngOnInit(): void {
    // Fetch logged-in user details
    this.user = {
      firstName: '',
      lastName: ''
    };
  }

  redirectToCreateAlert(): void {
    this.router.navigate(['/create-alert']); // Remplacez par votre route de création d'alerte
  }
}
