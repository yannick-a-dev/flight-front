import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-dialog',
  standalone: false,
  
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.scss'
})
export class ConfirmationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true); // Confirmer l'action (par exemple suppression)
  }

  onCancel(): void {
    this.dialogRef.close(false); // Annuler l'action
  }
}
