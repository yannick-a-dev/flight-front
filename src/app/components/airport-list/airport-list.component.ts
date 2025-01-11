import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { AirportDTO } from '../../model/airport';
import { AirportService } from '../../services/airport.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AirportEditComponent } from '../airport-edit/airport-edit.component';
import { Router } from '@angular/router';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-airport-list',
  standalone: false,
  
  templateUrl: './airport-list.component.html',
  styleUrl: './airport-list.component.scss'
})
export class AirportListComponent implements OnInit{

  airports: any[] = []; 
  displayedColumns: string[] = ['name', 'city', 'country', 'capacity', 'actions']; 

  constructor(
    private airportService: AirportService, 
    private dialog: MatDialog, 
    private router: Router 
  ) {}

  ngOnInit(): void {
    this.getAirports(); 
  }
  getAirports(): void {
    this.airportService.getAllAirports().subscribe(data => {
      this.airports = data;
    });
  }

  openEditDialog(airportId?: number): void {
    const dialogRef = this.dialog.open(AirportEditComponent, {
      width: '400px',
      data: { airportId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getAirports(); 
      }
    });
  }

  deleteAirport(id: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent);
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {  // Si l'utilisateur a confirmé la suppression
        this.airportService.deleteAirport(id).subscribe({
          next: (response: string) => {
            console.log('Réponse après suppression:', response);  // Affiche la réponse du backend
            this.getAirports();  // Recharger la liste après suppression
          },
          error: (error) => {
            console.error('Erreur lors de la suppression de l\'aéroport', error);
            alert(`Erreur inconnue: ${error.statusText} - ${error.message}`);
          }
        });
      }
    });
  }  
   
}
