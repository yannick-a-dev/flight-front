import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Flight } from '../model/flight';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FlightService {

  private baseUrl = `${environment.apiUrl}/api/flights`;
  private passengerUrl = `${environment.apiUrl}/api/passengers`;

  constructor(private http: HttpClient) { }

  // Obtenir tous les vols
  getFlights(): Observable<Flight[]> {
    return this.http.get<Flight[]>(this.baseUrl);
  }


  createFlight(flightDto: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, flightDto);
  }

  // Mettre à jour un vol
  updateFlight(id: number, flight: Flight): Observable<Flight> {
    return this.http.put<Flight>(`${this.baseUrl}/${id}`, flight);
  }

  // Supprimer un vol
  deleteFlight(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
  getFlightsByPassenger(passengerId: number): Observable<Flight[]> {
    return this.http.get<Flight[]>(`${this.passengerUrl}/${passengerId}/flights`);
  }
}
