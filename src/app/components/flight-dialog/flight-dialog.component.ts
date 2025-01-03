import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Flight } from '../../model/flight';

@Component({
  selector: 'app-flight-dialog',
  standalone: false,
  
  templateUrl: './flight-dialog.component.html',
  styleUrl: './flight-dialog.component.scss'
})
export class FlightDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<FlightDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Flight
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
