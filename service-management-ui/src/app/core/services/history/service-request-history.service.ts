import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ServiceRequestHistoryService {

  readonly baseUrl = 'http://localhost:5133/api/service-requests';

  constructor(readonly http: HttpClient) {}

  // CUSTOMER
  getMyHistory(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/my-history`);
  }

  // ADMIN
  getAllHistory(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/all`);
  }
}
