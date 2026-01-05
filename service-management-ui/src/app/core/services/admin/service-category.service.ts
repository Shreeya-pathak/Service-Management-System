import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface ServiceCategory {
  serviceCategoryId: number;
  categoryName: string;
  isActive?: boolean;   // optional
}

@Injectable({
  providedIn: 'root'
})
export class ServiceCategoryService {

  readonly baseUrl = 'http://localhost:5133/api/service-categories';

  constructor(readonly http: HttpClient) {}

  getAll(): Observable<ServiceCategory[]> {
    return this.http.get<ServiceCategory[]>(this.baseUrl);
  }

  create(data: { categoryName: string }): Observable<any> {
    return this.http.post(this.baseUrl, {
      CategoryName: data.categoryName
    });
  }

  update(id: number, data: { categoryName: string }): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, {
      CategoryName: data.categoryName
    });
  }

  // 🔴 DISABLE
  disable(id: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}/disable`, {});
  }

  // 🟢 ENABLE
  enable(id: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}/enable`, {});
  }

  
}
