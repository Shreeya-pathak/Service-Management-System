import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ServiceManagerService {

  private readonly baseUrl = 'http://localhost:5133/api/service-manager';

  constructor(readonly http: HttpClient) {}

  getDashboard(): Observable<any> {
    return this.http.get(`${this.baseUrl}/dashboard`);
  }

  getRequests(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/requests`);
  }

  getAvailableTechnicians(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/technicians`);
  }

  assignTechnician(
    requestId: number,
    technicianId: number,
    scheduledDate: string
  ) {
    return this.http.put(
      `${this.baseUrl}/requests/${requestId}/assign`,
      { technicianId, scheduledDate }
    );
  }
  getMonitorRequests(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/monitor-requests`);
  }

}
