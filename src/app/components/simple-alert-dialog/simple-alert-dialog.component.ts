import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-simple-alert-dialog',
  standalone: false,
  
  templateUrl: './simple-alert-dialog.component.html',
  styleUrl: './simple-alert-dialog.component.scss'
})
export class SimpleAlertDialogComponent {
  
constructor(
    @Inject(MAT_DIALOG_DATA) public data: { message: string },
    private dialogRef: MatDialogRef<SimpleAlertDialogComponent>
  ) {}

  close() {
    this.dialogRef.close();
  }
}
