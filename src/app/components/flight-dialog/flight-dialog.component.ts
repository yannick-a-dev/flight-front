import { AfterViewInit, Component, Inject, Input, OnInit, SimpleChanges } from '@angular/core';
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

export class FlightDialogComponent implements OnInit, AfterViewInit {
  // Supprimer l'@Input() data pour éviter le conflit
  isEditMode: boolean = false;
  flightForm: FormGroup;
  flight: any;

  constructor(
    private fb: FormBuilder,
    private flightService: FlightService,
    private dialogRef: MatDialogRef<FlightDialogComponent>, 
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any 
  ) { }

  ngOnInit(): void {
    if (this.data) {
      this.isEditMode = !!this.data?.flightNumber;
    } else {
      this.isEditMode = false; 
    }
  
    this.flightForm = this.fb.group({
      flightNumber: [this.data?.flightNumber || '', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      departureTime: [this.data?.departureTime || '', Validators.required],
      arrivalTime: [this.data?.arrivalTime || '', Validators.required],
      departureAirport: [this.data?.departureAirport || '', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      arrivalAirport: [this.data?.arrivalAirport || '', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      status: [this.data?.status || '', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      reservations: this.fb.array(this.data?.reservations || []),
      alerts: this.fb.array(this.data?.alerts || []),
    });
  
    console.log('Initial form value:', this.flightForm.value);
    console.log('Initial form validity:', this.flightForm.valid);
    console.log('Form errors:', this.flightForm.errors);
  
    this.flightForm.statusChanges.subscribe(status => {
      console.log('Form status changed:', status);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data) {
      this.flightForm.patchValue({
        flightNumber: this.data.flightNumber,
        departureTime: this.data.departureTime,
        arrivalTime: this.data.arrivalTime,
        departureAirport: this.data.departureAirport,
        arrivalAirport: this.data.arrivalAirport,
        status: this.data.status,
      });
    }
  }
  
  ngAfterViewInit(): void {
    // Ajout de l'écouteur d'événement 'wheel' avec passive: true
    const element = document.getElementById('yourElementId'); // Remplacez par l'ID approprié
    if (element) {
      element.addEventListener('wheel', this.onWheelEvent, { passive: true });
    }
  }

  // Accesseurs aux contrôles du formulaire
  get formControls() {
    return this.flightForm.controls;
  }

  // Accesseurs aux réservations et alertes
  get reservations(): FormArray {
    return this.flightForm.get('reservations') as FormArray;
  }

  get alerts(): FormArray {
    return this.flightForm.get('alerts') as FormArray;
  }

  // Méthodes pour ajouter des réservations et alertes
  addReservation(): void {
    this.reservations.push(this.fb.group({
      reservationDate: ['', Validators.required],
      seatNumber: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(1)]],
      passengerId: [null, [Validators.required]],
      flightId: [null, [Validators.required]]
    }));
  }

  addAlert(): void {
    this.alerts.push(this.fb.group({
      message: ['', Validators.required],
      alertDate: ['', Validators.required],
      severity: ['', Validators.required],
      passengerId: [null, Validators.required],
      flightId: [null, Validators.required]
    }));
  }

  // Supprimer une réservation ou alerte
  removeReservation(index: number): void {
    this.reservations.removeAt(index);
  }

  removeAlert(index: number): void {
    this.alerts.removeAt(index);
  }

  onSubmit(): void {
    console.log('Form status:', this.flightForm.status); // Affiche l'état du formulaire
    console.log('Form value:', this.flightForm.value);
  
    // Affichage de l'état de chaque contrôle
    for (const controlName in this.flightForm.controls) {
      if (this.flightForm.controls.hasOwnProperty(controlName)) {
        const control = this.flightForm.get(controlName);
        console.log(`Control: ${controlName}, Valid: ${control?.valid}, Errors:`, control?.errors);
      }
    }
  
    if (this.flightForm.valid) {
      const flightData = this.flightForm.value;
  
      if (this.isEditMode) {
        // Logique pour la mise à jour du vol
        this.flightService.updateFlight(this.flight.flightNumber, flightData).subscribe(response => {
          this.dialogRef.close(response);
          this.router.navigate(['/flights']);
        });
      } else {
        // Logique pour la création d'un nouveau vol
        this.flightService.createFlight(flightData).subscribe(response => {
          this.dialogRef.close(response);
          this.router.navigate(['/flights']);
        });
      }
    } else {
      console.log("Formulaire invalide");
    }
  }
  
  // Méthode de gestion de l'événement 'wheel'
  onWheelEvent(event: WheelEvent): void {
    console.log('Wheel event triggered', event);
  }
}
