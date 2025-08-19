import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthResponse } from '../model/authResponse';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = `${environment.apiUrl}/auth`; 

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<AuthResponse> {
    const body = { username, password };
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, body);
  }

  verifyOtp(username: string, otp: string): Observable<any> {
  const body = { username, otp };
  return this.http.post(`${this.baseUrl}/verifyCode`, body);
}


  register(passenger: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, passenger);
  }

  refreshToken(refreshToken: string): Observable<any> {
    const body = { refreshToken };
    return this.http.post(`${this.baseUrl}/refresh`, body);
  }

  checkPermissions(): Observable<any> {
    return this.http.get(`${this.baseUrl}/permissions`);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('accessToken');
    console.log('Checking authentication status, token:', token);
    return token ? true : false;  // Si le token est présent, l'utilisateur est authentifié
  }
  
}
