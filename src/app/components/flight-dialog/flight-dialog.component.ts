import { AfterViewInit, Component, Inject, Input, OnInit, SimpleChanges } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormArray, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { FlightService } from '../../services/flight.service';
import { DatePipe } from '@angular/common';
import { FlightStatus } from '../../model/flight-status';
import { Alert } from '../../model/alert';
import { Reservation } from '../../model/reservation';

@Component({
  selector: 'app-flight-dialog',
  standalone: false,

  templateUrl: './flight-dialog.component.html',
  styleUrl: './flight-dialog.component.scss'
})

export class FlightDialogComponent implements OnInit, AfterViewInit {

  statusList = Object.values(FlightStatus);
  isEditMode: boolean = false;
  isUpdateMode: boolean = false;
  flightForm: FormGroup;
  flight: any;

  constructor(
    private fb: FormBuilder,
    private flightService: FlightService,
    private dialogRef: MatDialogRef<FlightDialogComponent>,
    private router: Router,
    public datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    if (this.data) {
      this.isEditMode = !!this.data?.flightNumber;
      this.isUpdateMode = this.isEditMode;
      this.flight = this.data;
    } else {
      this.isEditMode = false;
      this.isUpdateMode = false;
      this.flight = {};
    }
  
    const formattedDepartureTime = this.formatDateISO(this.data?.departureTime);
    const formattedArrivalTime = this.formatDateISO(this.data?.arrivalTime);
  
    this.flightForm = this.fb.group({
      flightNumber: [this.data?.flightNumber || '', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      departureTime: [formattedDepartureTime, Validators.required],
      arrivalTime: [formattedArrivalTime, Validators.required],
      departureAirport: [this.data?.departureAirport || null, Validators.required],
      arrivalAirport: [this.data?.arrivalAirport || null, Validators.required],
      status: [this.data?.status && this.normalizeStatus(this.data.status) ? this.normalizeStatus(this.data.status): FlightStatus.ON_TIME, [Validators.required]],
      reservations: this.fb.array(this.mapReservations(this.data?.reservations || [])),
      alerts: this.fb.array(this.mapAlerts(this.data?.alerts || [])),
    });
  }
  
  private mapReservations(reservations: Reservation[]): FormGroup[] {
    return reservations.map(reservation => this.fb.group({
      id: [reservation.id],
      reservationDate: [
        this.formatDateISO(reservation.reservationDate), 
        Validators.required
      ],
      seatNumber: [reservation.seatNumber, [Validators.required, Validators.minLength(1), Validators.maxLength(10)]],
      price: [reservation.price, [Validators.required, Validators.min(0)]],
      passengerId: [reservation.passengerId, Validators.required],
    }));
  }
  
  private mapAlerts(alerts: Alert[]): FormGroup[] {
    return alerts.map(alert => this.fb.group({
      id: [alert.id],
      message: [alert.message, [Validators.required, Validators.maxLength(255)]],
      alertDate: [alert.alertDate, Validators.required],
      severity: [alert.severity, [Validators.required, this.validateSeverity]],
      passengerId: [alert.passengerId, Validators.required],
    }));
  }
  
private formatDateISO(date: string | Date | null): string {
  if (!date) return '';
  
  let dateObj = typeof date === 'string' ? new Date(date) : date;
  return this.datePipe.transform(dateObj, 'yyyy-MM-dd\'T\'HH:mm:ss') || '';
}



  
  private validateSeverity(control: AbstractControl): ValidationErrors | null {
    const allowedValues = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
    return allowedValues.includes(control.value) ? null : { invalidSeverity: true };
  }
  

  normalizeStatus(status: string): FlightStatus {
    const formattedStatus = status.replace(' ', '_').toUpperCase();  // Convertir l'espace en underscore et mettre en majuscule
    if (Object.values(FlightStatus).includes(formattedStatus as FlightStatus)) {
      return formattedStatus as FlightStatus;  
    } else {
      return FlightStatus.ON_TIME;  
    }
  }
  
onSubmit(): void {
  console.log('Form status:', this.flightForm.status); 
  console.log('Form value:', this.flightForm.value);

  for (const controlName in this.flightForm.controls) {
    if (this.flightForm.controls.hasOwnProperty(controlName)) {
      const control = this.flightForm.get(controlName);
      console.log(`Control: ${controlName}, Valid: ${control?.valid}, Errors:`, control?.errors);
    }
  }

  if (this.flightForm.valid) {
    const flightData = this.flightForm.value;

    // Reformater les dates si besoin
    flightData.departureTime = this.formatDateISO(flightData.departureTime);
    flightData.arrivalTime = this.formatDateISO(flightData.arrivalTime);

    console.log('Payload envoyé au backend :', JSON.stringify(flightData, null, 2));

    const request$ = this.isEditMode && this.flight?.flightNumber
      ? this.flightService.updateFlight(this.flight.flightNumber, flightData)
      : this.flightService.createFlight(flightData);

    request$.subscribe({
      next: response => {
        this.dialogRef.close(response);
        this.router.navigate(['home/flights']);
      },
      error: err => {
        console.error('Erreur lors de la requête:', err);
        if (err.error) {
          console.error('Détail erreur backend:', err.error);
          alert('Erreur backend : ' + JSON.stringify(err.error));
        } else {
          alert('Erreur inconnue lors de la requête.');
        }
      }
    });
  } else {
    console.log("Formulaire invalide");
  }
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
    const element = document.getElementById('yourElementId'); 
    if (element) {
      element.addEventListener('wheel', this.onWheelEvent, { passive: true });
    }
  }
  get formControls() {
    return this.flightForm.controls;
  }
  get reservations(): FormArray {
    return this.flightForm.get('reservations') as FormArray;
  }

  get alerts(): FormArray {
    return this.flightForm.get('alerts') as FormArray;
  }
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

  removeReservation(index: number): void {
    this.reservations.removeAt(index);
  }

  removeAlert(index: number): void {
    this.alerts.removeAt(index);
  }

  onWheelEvent(event: WheelEvent): void {
    console.log('Wheel event triggered', event);
  }

  setMode(isUpdate: boolean) {
    this.isUpdateMode = isUpdate;
  }
}
