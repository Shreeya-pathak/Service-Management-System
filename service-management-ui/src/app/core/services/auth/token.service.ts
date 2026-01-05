// src/app/core/services/token.service.ts
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TokenService {

  set(token: string, role: string, approvalStatus: string, fullName: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('approvalStatus', approvalStatus);
    localStorage.setItem('fullName', fullName);
  }

  clear() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('approvalStatus');
    localStorage.removeItem('fullName');
  }


  get token(): string | null {
    return localStorage.getItem('token');
  }

  get role(): string | null {
    return localStorage.getItem('role');
  }

  

  get approvalStatus(): string | null {
    return localStorage.getItem('approvalStatus');
  }

  get isLoggedIn(): boolean {
    return !!this.token;
  }

  get fullName(): string | null {
    const name = localStorage.getItem('fullName');
    return name && name !== 'undefined' ? name : null;
  }

}
