import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Service {
  serviceId: number;
  serviceName: string;
  price: number;
  slaHours: number;
  description: string;
  serviceCategoryId: number;
}

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  readonly baseUrl = 'http://localhost:5133/api/services';

  constructor(readonly http: HttpClient) {}

  getAll(): Observable<Service[]> {
    return this.http.get<Service[]>(this.baseUrl);
  }

  create(data: any): Observable<any> {
    const payload = {
      ServiceName: data.serviceName,
      Price: data.price,
      SLAHours: data.slaHours,
      Description: data.description,
      ServiceCategoryId: data.serviceCategoryId
    };

    return this.http.post(this.baseUrl, payload);
  }

  update(id: number, data: any): Observable<any> {
    const payload = {
      ServiceName: data.serviceName,
      Price: data.price,
      SLAHours: data.slaHours,
      Description: data.description,
      ServiceCategoryId: data.serviceCategoryId
    };

    return this.http.put(`${this.baseUrl}/${id}`, payload);
  }
}
