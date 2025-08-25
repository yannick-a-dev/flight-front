import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Reservation } from '../../model/reservation';
import { ReservationService } from '../../services/reservation.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-reservation-form',
  standalone: false,

  templateUrl: './reservation-form.component.html',
  styleUrl: './reservation-form.component.scss'
})
export class ReservationFormComponent {
  reservationForm!: FormGroup;
  flightNumber!: string;
  reservations: Reservation[] = [];
  dataSource = new MatTableDataSource<Reservation>();
  displayedColumns: string[] = ['passengerId', 'seatNumber', 'price', 'reservationDate'];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private reservationService: ReservationService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.flightNumber = this.route.snapshot.paramMap.get('flightNumber')!;

    this.reservationForm = this.fb.group({
      reservationDate: [this.formatDateForInput(null), Validators.required],
      seatNumber: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      passengerId: ['', Validators.required],
    });

    this.loadReservations();
  }

  formatDateForInput(date: Date | null): string {
    if (!date) return '';
    const d = new Date(date);
    const pad = (n: number) => n.toString().padStart(2, '0');
    const yyyy = d.getFullYear();
    const mm = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    const hh = pad(d.getHours());
    const min = pad(d.getMinutes());
    return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
  }

  loadReservations() {
    this.reservationService.getReservationsForFlight(this.flightNumber)
      .subscribe({
        next: (res) => {
          this.reservations = res.map(r => ({
            ...r,
            // Convertir seulement si reservationDate est défini
            reservationDate: r.reservationDate ? new Date(r.reservationDate) : null
          }));
          this.dataSource.data = this.reservations;
        },
        error: (err) => console.error('Error loading reservations:', err)
      });
  }

  onSubmit() {
    if (this.reservationForm.valid) {
      const formValue = this.reservationForm.value;

      const reservation: Reservation = {
        ...formValue,
        reservationDate: new Date(formValue.reservationDate)
      };

      this.reservationService.createReservation(this.flightNumber, reservation)
        .subscribe({
          next: (res) => {
            console.log('Reservation created:', res);

            // Ajouter la réservation et rafraîchir la table
            this.reservations = [...this.reservations, {
              ...res,
              reservationDate: formValue.reservationDate ? new Date(formValue.reservationDate) : new Date()

            }];
            this.dataSource.data = this.reservations;

            // Affiche un message de confirmation pendant 2 secondes puis redirige
            this.snackBar.open('Reservation created successfully!', 'Close', {
              duration: 2000,
              verticalPosition: 'top',
              horizontalPosition: 'center'
            }).afterDismissed().subscribe(() => {
              this.router.navigate(['/home/flights']);
            });
          },
          error: (err) => console.error('Error creating reservation:', err)
        });
    }
  }

}
