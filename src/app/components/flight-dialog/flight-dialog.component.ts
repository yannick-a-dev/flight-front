import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Flight } from '../../model/flight';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { FlightService } from '../../services/flight.service';

@Component({
  selector: 'app-flight-dialog',
  standalone: false,
  
  templateUrl: './flight-dialog.component.html',
  styleUrl: './flight-dialog.component.scss'
})
export class FlightDialogComponent implements OnInit {
  flightForm: FormGroup;

  constructor(private fb: FormBuilder, private flightService: FlightService, private router: Router) { }

  ngOnInit(): void {
    this.flightForm = this.fb.group({
      flightNumber: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      departureTime: ['', [Validators.required]],
      arrivalTime: ['', [Validators.required]],
      departureAirport: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(3)]],
      arrivalAirport: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(3)]],
      status: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      reservations: this.fb.array([this.createReservation()]),  // Initialiser avec un seul élément
      alerts: this.fb.array([this.createAlert()])  // Initialiser avec un seul élément
    });
  }

  // Créer une nouvelle réservation avec ses validations
  createReservation(): FormGroup {
    return this.fb.group({
      id: [null],
      reservationDate: ['', [Validators.required]],
      seatNumber: ['', [Validators.required]],
      price: ['', [Validators.required]],
      passengerId: ['', [Validators.required]],
      flightId: ['', [Validators.required]]
    });
  }

  // Créer une nouvelle alerte avec ses validations
  createAlert(): FormGroup {
    return this.fb.group({
      id: [null],
      alertMessage: ['', [Validators.required]],
      alertTime: ['', [Validators.required]]
    });
  }

  // Récupérer les messages d'erreur pour chaque champ du formulaire
  get formControls() {
    return this.flightForm.controls;
  }

  // Accéder à la liste des réservations
  get reservations() {
    return (this.flightForm.get('reservations') as FormArray);
  }

  // Ajouter une nouvelle réservation
  addReservation() {
    this.reservations.push(this.createReservation());
  }

  // Accéder à la liste des alertes
  get alerts() {
    return (this.flightForm.get('alerts') as FormArray);
  }

  // Ajouter une nouvelle alerte
  addAlert() {
    this.alerts.push(this.createAlert());
  }

  // Soumettre le formulaire
  onSubmit(): void {
    if (this.flightForm.invalid) {
      return;  // Ne pas soumettre si le formulaire est invalide
    }

    const flightData = this.flightForm.value;
    this.flightService.createFlight(flightData).subscribe(
      response => {
        console.log('Flight created successfully', response);
        this.router.navigate(['/flights']);  // Rediriger après la soumission réussie
      },
      error => {
        console.error('Error creating flight', error);
      }
    );
  }

  hasError(controlName: string, errorName: string): boolean {
    const control = this.flightForm.get(controlName);
    return control?.hasError(errorName) && control?.touched ? true : false;
  }
  
  
}