import { Component, HostListener, OnInit ,ChangeDetectorRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { TokenService } from '../../core/services/auth/token.service';
import { NotificationService, NotificationDto } from '../../core/services/notifications/notification.service';
import { interval, Subscription } from 'rxjs';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent implements OnInit {

  isScrolled = false;
  

  // 🔔 Notifications
  notifications: NotificationDto[] = [];
  unreadCount = 0;
  showNotifications = false;
  private pollSub?: Subscription;
  constructor(
    public tokenService: TokenService,
    readonly router: Router,
    readonly notificationService: NotificationService,
    readonly cdr:ChangeDetectorRef
  ) {}

  // ================= EXISTING GETTERS =================
  get role() {
    return this.tokenService.role;
  }

  get isLoggedIn() {
    return this.tokenService.isLoggedIn;
  }

  get fullName() {
    return this.tokenService.fullName;
  }

  // ================= NOTIFICATION LOGIC =================
  ngOnInit() {
    if (this.isLoggedIn) {
      this.loadNotifications();
      this.loadUnreadCount();
      this.pollSub = interval(10000).subscribe(() => {
      this.loadNotifications();
    });
    }
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
    this.cdr.detectChanges();
  }

  loadNotifications() {
    this.notificationService.getNotifications().subscribe(data => {
      this.notifications = data;
      this.cdr.detectChanges();
      this.refreshUnreadCount();
    });
  }
  refreshUnreadCount() {
    this.notificationService.getUnreadCount()
      .subscribe(res => this.unreadCount = res.count);
  }
  loadUnreadCount() {
    this.notificationService.getUnreadCount().subscribe(res => {
      this.unreadCount = res.count;
      this.cdr.detectChanges();
    });
  }

  markAsRead(n: NotificationDto) {
    if (n.isRead) return;

    this.notificationService.markAsRead(n.notificationId).subscribe(() => {
      n.isRead = true;
      this.refreshUnreadCount();
      this.cdr.detectChanges();
    });
  }

  markAllAsRead() {
    this.notificationService.markAllAsRead().subscribe(() => {
      this.notifications.forEach(n => n.isRead = true);
      
      this.refreshUnreadCount();
      this.cdr.detectChanges();
    });
  }

  // ================= EXISTING LOGOUT =================
  logout() {
    this.tokenService.clear();
    this.router.navigate(['/login']);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;

    // Close if click is outside notification wrapper
    if (!target.closest('.notification-wrapper')) {
      this.showNotifications = false;
    }
  }

}
