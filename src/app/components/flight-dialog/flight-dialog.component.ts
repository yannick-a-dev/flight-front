import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FlightService } from '../../services/flight.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-flight-dialog',
  standalone: false,

  templateUrl: './flight-dialog.component.html',
  styleUrl: './flight-dialog.component.scss'
})
export class FlightDialogComponent {
  flightForm!: FormGroup;
  isEditMode = false;
  flightId!: number;
  flightNumber!: string;
  statusList = ['ON_TIME', 'CANCELLED', 'DELAYED', 'BOARDING', 'LANDED'];

  constructor(
    private flightService: FlightService,
    private fb: FormBuilder,
    private router: Router,
    private dialogRef: MatDialogRef<FlightDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngAfterViewInit(): void {
    console.log('Le formulaire est maintenant visible');
  }

  ngOnInit(): void {
    // Vérifie si on est en mode édition
    this.flightNumber = this.data?.flightNumber;
    this.isEditMode = !!this.flightNumber;

    // Initialise le formulaire
    this.flightForm = this.fb.group({
      flightNumber: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      departureTime: ['', Validators.required],
      arrivalTime: ['', Validators.required],
      departureAirport: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(3)]],
      arrivalAirport: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(3)]],
      status: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
    });

    // Si édition, charge les données existantes
    if (this.isEditMode) {
      this.flightService.getByFlightNumber(this.flightNumber).subscribe((data: { flightNumber: any; departureTime: string; arrivalTime: string; departureAirport: any; arrivalAirport: any; status: any; }) => {
        this.flightForm.patchValue({
          flightNumber: data.flightNumber,
          departureTime: this.formatDateForInput(data.departureTime),
          arrivalTime: this.formatDateForInput(data.arrivalTime),
          departureAirport: data.departureAirport,
          arrivalAirport: data.arrivalAirport,
          status: data.status
        });
      });
    }
  }

  private formatDateForInput(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    // On tronque à YYYY-MM-DDTHH:mm pour que <input type="datetime-local"> accepte la valeur
    return date.toISOString().slice(0, 16);
  }


  get formControls() {
    return this.flightForm.controls;
  }

  onSubmit(): void {
    if (this.flightForm.invalid) return;

    const formValue = this.flightForm.value;

    const flightData = {
      ...formValue,
      departureTime: new Date(formValue.departureTime).toISOString(),
      arrivalTime: new Date(formValue.arrivalTime).toISOString(),
      reservations: [],
      alerts: []
    };

    if (this.isEditMode) {
      this.flightService.updateFlight(this.flightNumber, flightData)
        .subscribe({
          next: () => this.dialogRef.close(true),
          error: (err) => console.error('Erreur lors de la mise à jour:', err)
        });
    } else {
      this.flightService.createFlight(flightData)
        .subscribe({
          next: () => this.dialogRef.close(true),
          error: (err) => console.error('Erreur lors de la création:', err)
        });
    }
  }



  goToAddReservation() {
    this.router.navigate([`/flights/${this.flightNumber}/reservations/new`]).then(() => this.dialogRef.close());
  }

  goToAddAlert() {
    this.dialogRef.close();
    this.router.navigate([`/flights/${this.flightNumber}/alerts/new`]).then(() => this.dialogRef.close());
  }

  onClose() {
    this.dialogRef.close(false);
  }
}
