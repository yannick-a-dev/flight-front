import { AfterViewInit, Component, Inject, Input, OnInit, SimpleChanges } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { FlightService } from '../../services/flight.service';
import { DatePipe } from '@angular/common';
import { FlightStatus } from '../../model/flight-status';

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
  
    const formattedDepartureTime = this.datePipe.transform(this.data?.departureTime, 'yyyy-MM-dd\'T\'HH:mm:ss') || '';
    const formattedArrivalTime = this.datePipe.transform(this.data?.arrivalTime, 'yyyy-MM-dd\'T\'HH:mm:ss') || '';
  
    console.log('Formatted Departure Time:', formattedDepartureTime);
    console.log('Formatted Arrival Time:', formattedArrivalTime);
  
    this.flightForm = this.fb.group({
      flightNumber: [this.data?.flightNumber || '', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      departureTime: [formattedDepartureTime, Validators.required],
      arrivalTime: [formattedArrivalTime, Validators.required],
      departureAirport: [this.data?.departureAirport || '', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      arrivalAirport: [this.data?.arrivalAirport || '', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      status: [
        this.data?.status && this.normalizeStatus(this.data.status) 
        ? this.normalizeStatus(this.data.status)
        : FlightStatus.ON_TIME, 
        [Validators.required]
      ],
      reservations: this.fb.array(this.data?.reservations || []),
      alerts: this.fb.array(this.data?.alerts || []),
    });
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

      if (this.isEditMode && this.flight?.flightNumber) { 
        this.flightService.updateFlight(this.flight.flightNumber, flightData).subscribe(response => {
          this.dialogRef.close(response);
          this.router.navigate(['home/flights']);
        });
      } else {
        this.flightService.createFlight(flightData).subscribe(response => {
          this.dialogRef.close(response);
          this.router.navigate(['home/flights']);
        });
      }
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
