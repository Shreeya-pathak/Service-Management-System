import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ReportsService {

  readonly baseUrl = 'http://localhost:5133/api/reports';

  constructor(readonly http: HttpClient) {}

  // 🔹 Technician Workload (ACTIVE requests only)
  getTechnicianWorkload(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}/technician-workload`
    );
  }

  // 🔹 Average Resolution Time
  getAverageResolutionTime(): Observable<{
    averageDays: number;
    totalResolved: number;
  }> {
    return this.http.get<{
      averageDays: number;
      totalResolved: number;
    }>(
      `${this.baseUrl}/average-resolution-time`
    );
  }

  // 🔹 Service Requests grouped by Status
  getRequestsByStatus(): Observable<
    { status: string; count: number }[]
  > {
    return this.http.get<
      { status: string; count: number }[]
    >(
      `${this.baseUrl}/service-requests/by-status`
    );
  }

  // 🔹 Service Requests grouped by Category
  getRequestsByCategory(): Observable<
    { categoryName: string; count: number }[]
  > {
    return this.http.get<
      { categoryName: string; count: number }[]
    >(
      `${this.baseUrl}/service-requests/by-category`
    );
  }
  getMonthlyRevenue(year: number, month: number): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/monthly-revenue?year=${year}&month=${month}`
    );
  }
}
