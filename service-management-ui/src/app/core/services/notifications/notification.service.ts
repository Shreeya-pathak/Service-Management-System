import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface NotificationDto {
  notificationId: number;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {

  readonly baseUrl = 'http://localhost:5133/api/notifications';

  constructor(readonly http: HttpClient) {}

  getNotifications(): Observable<NotificationDto[]> {
    return this.http.get<NotificationDto[]>(this.baseUrl);
  }

  getUnreadCount(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${this.baseUrl}/unread-count`);
  }

  markAsRead(id: number) {
    return this.http.put(`${this.baseUrl}/${id}/read`, {});
  }

  markAllAsRead() {
    return this.http.put(`${this.baseUrl}/mark-all-read`, {});
  }
}
