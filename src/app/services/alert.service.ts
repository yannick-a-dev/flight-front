import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { Alert } from '../model/alert';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  private baseUrl = `${environment.apiUrl}/api/alerts`;

  constructor(private http: HttpClient) {}

  // Création d'alerte
  createAlert(alert: Partial<Alert>): Observable<Alert> {
    return this.http.post<Alert>(this.baseUrl, alert);
  }

  // Récupérer toutes les alertes
getAllAlerts(): Observable<Alert[]> {
  return this.http.get<any[]>(`${this.baseUrl}/all`).pipe(
    map(data => data.map(a => ({
      id: a.id,
      message: a.message,
      alertDate: a.alertDate ? new Date(a.alertDate) : null, 
      severity: a.severity,
      passengerId: a.passenger?.id ?? null,
      flightNumber: a.flight?.flightNumber ?? null
    })))
  );
}

  // Récupérer alert par ID
  getAlertById(id: number): Observable<Alert> {
    return this.http.get<Alert>(`${this.baseUrl}/${id}`).pipe(
      map(a => ({
        ...a,
        alertDate: a.alertDate ? new Date(a.alertDate) : null
      }))
    );
  }

  // Récupérer les alertes d’un passager
  getAlertsForPassenger(passengerId: number): Observable<Alert[]> {
    return this.http.get<Alert[]>(`${this.baseUrl}/passenger/${passengerId}`).pipe(
      map(alerts => alerts.map(a => ({
        ...a,
        alertDate: a.alertDate ? new Date(a.alertDate) : null
      })))
    );
  }

  // Récupérer les alertes d’un vol
  getAlertsForFlight(flightNumber: string): Observable<Alert[]> {
    return this.http.get<Alert[]>(`${this.baseUrl}/${flightNumber}/alerts`).pipe(
      map(alerts => alerts.map(a => ({
        ...a,
        alertDate: a.alertDate ? new Date(a.alertDate) : null
      })))
    );
  }
}
