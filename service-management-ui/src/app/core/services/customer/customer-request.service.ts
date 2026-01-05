import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CustomerRequestService {

  private readonly baseUrl = 'http://localhost:5133/api';

  constructor(readonly http: HttpClient) {}

  // =====================================================
  // 🔹 CATEGORIES
  // =====================================================

  // ❌ Admin / internal (keep, do not remove)
  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/service-categories`);
  }

  // ✅ Customer booking (ACTIVE ONLY)
  getActiveCategories(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}/service-categories/active`
    );
  }

  // =====================================================
  // 🔹 SERVICES
  // =====================================================

  // ❌ Admin / internal (keep)
  getServicesByCategory(categoryId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}/services/by-category/${categoryId}`
    );
  }

  // ✅ Customer booking (ACTIVE ONLY)
  getActiveServicesByCategory(categoryId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}/services/by-category/${categoryId}/active`
    );
  }

  // =====================================================
  // 🔹 SERVICE REQUESTS
  // =====================================================

  createRequest(payload: any): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/service-requests`,
      payload
    );
  }

  getMyRequests(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}/service-requests/my`
    );
  }

  updateIssue(requestId: number, payload: any): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/service-requests/${requestId}/update-issue`,
      payload
    );
  }

  cancelRequest(requestId: number): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/service-requests/${requestId}/cancel`,
      {}
    );
  }

  rescheduleRequest(requestId: number, payload: any): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/service-requests/${requestId}/update-requested-date`,
      payload
    );
  }

  // =====================================================
  // 🔹 INVOICES
  // =====================================================

  getInvoiceByServiceRequest(serviceRequestId: number): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/invoices/by-service-request/${serviceRequestId}`
    );
  }

  makePayment(invoiceId: number): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/invoices/make-payment/${invoiceId}`,
      {}
    );
  }
}
