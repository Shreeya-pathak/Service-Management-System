import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ManagedUser {
  userId: number;
  fullName: string;
  email: string;
  phoneNumber?: string;
  roleName: string;
  isActive: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {

  readonly api = 'http://localhost:5133/api/admin/users';

  constructor(readonly http: HttpClient) {}

  getAll(): Observable<ManagedUser[]> {
    return this.http.get<ManagedUser[]>(this.api);
  }

  toggleStatus(userId: number): Observable<string> {
    return this.http.patch(
      `${this.api}/${userId}/toggle-status`,
      {},
      { responseType: 'text' }
    );
  }
}
