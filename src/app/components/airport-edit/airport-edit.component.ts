import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AirportService } from '../../services/airport.service';

@Component({
  selector: 'app-airport-edit',
  standalone: false,

  templateUrl: './airport-edit.component.html',
  styleUrl: './airport-edit.component.scss'
})
export class AirportEditComponent implements OnInit {
  airportForm: FormGroup;
  editMode: boolean = false;
  airportId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private airportService: AirportService,
    public dialogRef: MatDialogRef<AirportEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.airportId = this.data.airportId || null;
    this.editMode = !!this.airportId;

    this.airportForm = this.fb.group({
      name: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      capacity: ['', [Validators.required, Validators.min(1)]],
      international: [false],
      isActive: [true],
      terminalInfo: ['', Validators.required],
      timezone: ['', Validators.required],
      location: ['', Validators.required],  
      code: ['', Validators.required] 
    });

    if (this.editMode) {
      this.loadAirportData();
    }
  }

  loadAirportData(): void {
    this.airportService.getAllAirports().subscribe(airports => {
      const airport = airports.find(a => a.id === this.airportId);
      if (airport) {
        this.airportForm.patchValue(airport);
      }
    });
  }


  submitForm(): void {
    if (this.airportForm.invalid) {
      return;
    }
    const airportData = this.airportForm.value;

    if (this.editMode) {
      if (this.airportId !== null) {
        this.airportService.updateAirport(this.airportId, airportData).subscribe(() => {
          this.dialogRef.close(true);
        });
      } else {
        console.error('Airport ID is null');
      }
    } else {
      this.airportService.createAirport(airportData).subscribe(() => {
        this.dialogRef.close(true);
      });
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
