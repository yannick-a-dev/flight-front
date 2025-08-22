import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Alert } from '../../model/alert';
import { Flight } from '../../model/flight';
import { Reservation } from '../../model/reservation';
import { AlertService } from '../../services/alert.service';
import { FlightService } from '../../services/flight.service';
import { ReservationService } from '../../services/reservation.service';

@Component({
  selector: 'app-flight-detail',
  standalone: false,

  templateUrl: './flight-detail.component.html',
  styleUrl: './flight-detail.component.scss'
})
export class FlightDetailComponent {
  flightNumber: string;
  flight: Flight;
  reservations: Reservation[] = [];
  alerts: Alert[] = [];

  constructor(
    private route: ActivatedRoute,
    private flightService: FlightService,
    private reservationService: ReservationService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.flightNumber = this.route.snapshot.paramMap.get('flightNumber')!;

    this.flightService.getByFlightNumber(this.flightNumber).subscribe(flight => {
      this.flight = flight;
    });

    this.reservationService.getReservationsForFlight(this.flightNumber)
      .subscribe(res => this.reservations = res);

    this.alertService.getAlertsForFlight(this.flightNumber)
      .subscribe(res => this.alerts = res);
  }

  get validAlerts() {
    return this.alerts?.filter(a => !!a.severity) || [];
  }

}
