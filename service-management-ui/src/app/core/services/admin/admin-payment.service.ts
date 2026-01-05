import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AdminPaymentService {

  private readonly baseUrl = 'http://localhost:5133/api';

  constructor(readonly http: HttpClient) {}

  // 🔹 Get invoices waiting for admin approval
  getPendingPaymentApprovals(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}/invoices/pending-approvals`
    );
  }

  // 🔹 Approve a payment
  approvePayment(invoiceId: number, body: any) {
    return this.http.put(
      `${this.baseUrl}/invoices/approve-payment/${invoiceId}`,
      body
    );
  }
}
