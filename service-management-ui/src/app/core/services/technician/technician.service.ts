import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TechnicianService {

  private readonly baseUrl = 'http://localhost:5133/api/technician';

  constructor(readonly http: HttpClient) {}

  getDashboard(): Observable<any> {
    return this.http.get(`${this.baseUrl}/dashboard`);
  }

  getAssignedRequests(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/requests`);
  }

  updateRequestStatus(id: number, status: string, remarks: string) {
    return this.http.put(
      `${this.baseUrl}/requests/${id}/status`,
      { status,remarks}
    );
  }

  updateAvailability(status: string) {
    return this.http.put(
      `${this.baseUrl}/availability`,
      { availabilityStatus: status }
    );
  }
}
