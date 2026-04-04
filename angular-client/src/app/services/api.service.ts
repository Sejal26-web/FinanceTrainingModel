import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = '/api';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  // Auth
  register(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/register`, data);
  }

  login(data: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, data);
  }

  getProfile(): Observable<any> {
    return this.http.get(`${this.baseUrl}/auth/profile`, { headers: this.getHeaders() });
  }

  updateProfile(data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/auth/profile`, data, { headers: this.getHeaders() });
  }

  // Predictions
  submitPrediction(data: any): Observable<any> {
    const headers = this.getHeaders();
    if (data instanceof FormData) {
      return this.http.post(`${this.baseUrl}/predictions`, data, { headers });
    }
    return this.http.post(`${this.baseUrl}/predictions`, data, { headers });
  }

  getPredictions(): Observable<any> {
    return this.http.get(`${this.baseUrl}/predictions`, { headers: this.getHeaders() });
  }

  getMyPredictions(): Observable<any> {
    return this.http.get(`${this.baseUrl}/predictions/my`, { headers: this.getHeaders() });
  }

  getPredictionStats(): Observable<any> {
    return this.http.get(`${this.baseUrl}/predictions/stats`, { headers: this.getHeaders() });
  }

  getMetrics(): Observable<any> {
    return this.http.get(`${this.baseUrl}/metrics`, { headers: this.getHeaders() });
  }
}
