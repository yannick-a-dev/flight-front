import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FlightService } from '../../services/flight.service';
import { Flight } from '../../model/flight';
import { MatTableDataSource } from '@angular/material/table';
import { FlightDialogComponent } from '../flight-dialog/flight-dialog.component';

@Component({
  selector: 'app-flight',
  standalone: false,
  
  templateUrl: './flight.component.html',
  styleUrl: './flight.component.scss'
})

export class FlightComponent implements OnInit {
  displayedColumns: string[] = ['flightNumber', 'departureTime', 'arrivalTime', 'status', 'actions'];
  dataSource = new MatTableDataSource<Flight>();

  constructor(private flightService: FlightService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadFlights();
  }

  // Charger tous les vols
  loadFlights(): void {
    this.flightService.getFlights().subscribe(flights => {
      this.dataSource.data = flights;
    });
  }

  openEditDialog(flight: Flight): void {
    const dialogRef = this.dialog.open(FlightDialogComponent, {
      data: flight,  
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadFlights();  
      }
    });
  }
  
  openDialog(): void {
    const dialogRef = this.dialog.open(FlightDialogComponent, {
      data: null,  
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadFlights(); 
      }
    });
  }
  
  // Supprimer un vol
  deleteFlight(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce vol?')) {
      this.flightService.deleteFlight(id).subscribe(() => {
        this.loadFlights(); // Rafraîchir la liste après suppression
      });
    }
  }
}