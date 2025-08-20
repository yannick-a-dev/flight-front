import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthResponse } from '../model/authResponse';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authStatus = new BehaviorSubject<boolean>(this.isAuthenticated());
  authStatus$ = this.authStatus.asObservable();

  private baseUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<AuthResponse> {
    const body = { username, password };
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, body);
  }

   loginSuccess(accessToken: string, refreshToken: string): void {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    this.authStatus.next(true); // notifier la connexion
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

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.authStatus.next(false);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      return false;
    }

    try {
      const decoded: any = jwtDecode(token);
      const now = Math.floor(Date.now() / 1000);
      return decoded.exp && decoded.exp > now; // true si non expiré
    } catch (e) {
      console.error('Invalid token', e);
      return false;
    }
  }

}

