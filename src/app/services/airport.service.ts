import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AirportDTO } from '../model/airport';

@Injectable({
  providedIn: 'root'
})
export class AirportService {

  private apiUrl =  `${environment.apiUrl}/api/airports`;

  constructor(private http: HttpClient) {}

  getAllAirports(): Observable<AirportDTO[]> {
    return this.http.get<AirportDTO[]>(this.apiUrl);
  }

  getAirportById(id: number): Observable<AirportDTO> {
    return this.http.get<AirportDTO>(`${this.apiUrl}/${id}`);
  }

  createAirport(airport: AirportDTO): Observable<AirportDTO> {
    return this.http.post<AirportDTO>(this.apiUrl, airport);
  }

  updateAirport(id: number, airport: AirportDTO): Observable<AirportDTO> {
    return this.http.put<AirportDTO>(`${this.apiUrl}/${id}`, airport);
  }

  deleteAirport(id: number): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/${id}`, { responseType: 'text' as 'json' });
  }
  
}
