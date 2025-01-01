import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Alert } from '../model/alert';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  private baseUrl = `${environment.apiUrl}/api/alerts`;

  constructor(private http: HttpClient) {}

  getAlertsForPassenger(passengerId: number): Observable<Alert[]> {
    return this.http.get<Alert[]>(`${this.baseUrl}/${passengerId}`);
  }

  createAlert(alert: Partial<Alert>): Observable<Alert> {
    return this.http.post<Alert>(this.baseUrl, alert);
  }
  
  getAllAlerts(): Observable<Alert[]> {
    return this.http.get<Alert[]>(this.baseUrl);
  }

  getAlertById(id: number): Observable<Alert> {
    return this.http.get<Alert>(`${this.baseUrl}/${id}`);
  }
}
