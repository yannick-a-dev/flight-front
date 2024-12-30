import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PassengerService } from '../../services/passenger.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { UpdatePassengerComponent } from '../update-passenger/update-passenger.component';
import { Passenger } from '../../model/model';

@Component({
  selector: 'app-home',
  standalone: false,
  
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  displayedColumns: string[] = ['id', 'firstName', 'lastName', 'email', 'phone', 'actions'];
  dataSource: MatTableDataSource<Passenger> = new MatTableDataSource<Passenger>();

  constructor(
    private passengerService: PassengerService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPassengers();
  }

  loadPassengers(): void {
    this.passengerService.getAllPassengers().subscribe({
      next: (data) => {
        this.dataSource.data = data;
      },
      error: () => {
        // Handle error
      }
    });
  }

  openUpdateDialog(id: number): void {
    const dialogRef = this.dialog.open(UpdatePassengerComponent, {
      width: '400px',
      data: { id }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.loadPassengers();
    });
  }

  // Supprimer un passager
  deletePassenger(id: number): void {
    if (confirm('Are you sure you want to delete this passenger?')) {
      this.passengerService.deletePassenger(id).subscribe({
        next: () => {
          this.loadPassengers();
        },
        error: () => {
          // Handle error
        }
      });
    }
  }
}