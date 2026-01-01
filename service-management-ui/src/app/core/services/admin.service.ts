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

}
