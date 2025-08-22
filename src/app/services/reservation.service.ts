import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reservation } from '../model/reservation';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  private baseUrl = `${environment.apiUrl}/api/flights`;

  constructor(private http: HttpClient) { }

  createReservation(flightNumber: string, reservation: Reservation): Observable<Reservation> {
    return this.http.post<Reservation>(`${this.baseUrl}/${flightNumber}/reservations`, reservation);
  }

  getReservationsForFlight(flightNumber: string): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.baseUrl}/${flightNumber}/reservations`);
  }

}
