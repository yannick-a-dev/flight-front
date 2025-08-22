import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Alert } from '../../model/alert';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-alert-form',
  standalone: false,

  templateUrl: './alert-form.component.html',
  styleUrl: './alert-form.component.scss'
})
export class AlertFormComponent {
  alertForm!: FormGroup;
  flightNumber!: string;

  severities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    // Récupération du numéro de vol depuis l’URL
    this.flightNumber = this.route.snapshot.paramMap.get('flightNumber')!;

    this.alertForm = this.fb.group({
      message: ['', [Validators.required, Validators.minLength(5)]],
      alertDate: ['', Validators.required],
      severity: ['', Validators.required],
      passengerId: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.alertForm.invalid) {
      return;
    }

    const newAlert: Partial<Alert> = {
      message: this.alertForm.value.message,
      alertDate: this.alertForm.value.alertDate,
      severity: this.alertForm.value.severity,
      passengerId: this.alertForm.value.passengerId,
      flightNumber: this.flightNumber
    };

    this.alertService.createAlert(newAlert).subscribe({
      next: () => {
        alert('Alert created successfully');
        this.router.navigate([`/flights/${this.flightNumber}/alerts`]);
      },
      error: (err) => {
        console.error(err);
        alert('Error creating alert');
      }
    });
  }

}
