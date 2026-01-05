import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AdminReportsService {

  private readonly baseUrl = 'http://localhost:5133/api';

  constructor(readonly http: HttpClient) {}

  // 🔹 Monthly revenue report
  getMonthlyRevenue(year: number, month: number): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/reports/monthly-revenue?year=${year}&month=${month}`
    );
  }
  getTechnicianWorkload() {
    return this.http.get<any[]>(`${this.baseUrl}/reports/technician-workload`);
  }
  // 🔹 Average Resolution Time
  getAverageResolutionTime() {
    return this.http.get<any>(
      `${this.baseUrl}/reports/average-resolution-time`
    );
  }

  // 🔹 Requests by Status
  getRequestsByStatus() {
    return this.http.get<any[]>(
      `${this.baseUrl}/reports/service-requests/by-status`
    );
  }

  // 🔹 Requests by Category
  getRequestsByCategory() {
    return this.http.get<any[]>(
      `${this.baseUrl}/reports/service-requests/by-category`
    );
  }

}
