import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PaymentHistoryService {

  private readonly baseUrl = 'http://localhost:5133/api/payments';

  constructor(readonly http: HttpClient) {}

  getPaymentHistory(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/history`);
  }
}
