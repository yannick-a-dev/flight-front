import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PassengerService {

  private baseUrl: string = `${environment.apiUrl}/api/passengers`;  

  constructor(private http: HttpClient) {}

  getAllPassengers(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  getPassengerNames(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/names`);
  }

  getPassengerById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  updatePassenger(id: number, passenger: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, passenger);
  }

  deletePassenger(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
