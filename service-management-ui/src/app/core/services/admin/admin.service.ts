import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({ providedIn: 'root' })
export class AdminService {

  readonly api = 'http://localhost:5133/api/admin';

  constructor(readonly http: HttpClient) {}
  

  getPendingUsers() {
    return this.http.get<any[]>(`${this.api}/pending-users`);
  }

  approveUser(userId: number) {
    return this.http.post(
      `${this.api}/approve`,
      { userId },
      { responseType: 'text' } 
    );
  }

  rejectUser(userId: number) {
    return this.http.post(
      `${this.api}/reject`,
      { userId },
      { responseType: 'text' } 
    );
  }
  getPendingPaymentApprovals() {
    return this.http.get<any[]>(
      `${this.api}/invoices/pending-approvals`
    );
  }

  approvePayment(invoiceId: number) {
    return this.http.put(
      `${this.api}/invoices/approve-payment/${invoiceId}`,
      {}
    );
  }

  // 🔹 Monthly revenue
  getMonthlyRevenue(year: number, month: number) {
    return this.http.get<any>(
      `${this.api}/reports/monthly-revenue?year=${year}&month=${month}`
    );
  }

}
