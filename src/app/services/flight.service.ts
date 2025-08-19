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
  getByNumber: any;

  constructor(private http: HttpClient) { }

  // Obtenir tous les vols
  getFlights(): Observable<Flight[]> {
    return this.http.get<Flight[]>(this.baseUrl);
  }

  getByFlightNumber(flightNumber: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${flightNumber}`);
  }

  createFlight(flightDto: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, flightDto);
  }

  // Mettre à jour un vol
  updateFlight(flightNumber: string, flight: Flight): Observable<Flight> {
    return this.http.put<Flight>(`${this.baseUrl}/${flightNumber}`, flight);
  }


  // Supprimer un vol
  deleteFlight(flightNumber: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${flightNumber}`);
  }
  getFlightsByPassenger(passengerId: number): Observable<Flight[]> {
    return this.http.get<Flight[]>(`${this.passengerUrl}/${passengerId}/flights`);
  }
}
