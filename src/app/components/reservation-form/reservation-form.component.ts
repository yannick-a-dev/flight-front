import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Reservation } from '../../model/reservation';
import { ReservationService } from '../../services/reservation.service';

@Component({
  selector: 'app-reservation-form',
  standalone: false,

  templateUrl: './reservation-form.component.html',
  styleUrl: './reservation-form.component.scss'
})
export class ReservationFormComponent {
  reservationForm!: FormGroup;
  flightNumber!: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private reservationService: ReservationService
  ) { }

  ngOnInit(): void {
    // Récupère le flightNumber depuis l'URL
    this.flightNumber = this.route.snapshot.paramMap.get('flightNumber')!;

    // Initialise le formulaire
    this.reservationForm = this.fb.group({
      reservationDate: ['', Validators.required],
      seatNumber: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      passengerId: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.reservationForm.valid) {
      const reservation: Reservation = {
        ...this.reservationForm.value,
        // Optionnel : flightNumber peut être utilisé côté backend
      };

      this.reservationService.createReservation(this.flightNumber, reservation)
        .subscribe({
          next: (res) => {
            console.log('Reservation created:', res);
            this.router.navigate(['/home/flights', this.flightNumber]); 
          },
          error: (err) => console.error('Error creating reservation:', err)
        });
    }
  }
}
