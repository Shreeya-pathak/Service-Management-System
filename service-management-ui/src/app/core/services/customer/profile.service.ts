import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProfileService {

  private readonly baseUrl = 'http://localhost:5133/api/users';

  constructor(readonly http: HttpClient) {}

  getMyProfile(): Observable<any> {
    return this.http.get(`${this.baseUrl}/me`);
  }

  updateMyProfile(data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/me`, data);
  }

  deleteMyAccount() {
    return this.http.delete(`${this.baseUrl}/me`);
  }

}
