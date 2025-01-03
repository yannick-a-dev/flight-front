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

  // Ajouter un nouveau vol
  openDialog(): void {
    const dialogRef = this.dialog.open(FlightDialogComponent, {
      width: '250px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.flightService.createFlight(result).subscribe(() => {
          this.loadFlights(); // Rafraîchir la liste après ajout
        });
      }
    });
  }

  // Mettre à jour un vol
  openEditDialog(flight: Flight): void {
    const dialogRef = this.dialog.open(FlightDialogComponent, {
      width: '250px',
      data: flight
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.flightService.updateFlight(flight.id, result).subscribe(() => {
          this.loadFlights(); // Rafraîchir la liste après mise à jour
        });
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