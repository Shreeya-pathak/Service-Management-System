import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';

import { AdminService } from '../../../core/services/admin/admin.service';
import { SnackbarService } from '../../../shared/snackbar.service';


@Component({
  selector: 'app-approval-pending',
  standalone: true,
  templateUrl: './approval-pending.html',
  styleUrls: ['./approval-pending.css'],
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule
  ]
})
export class ApprovalPendingComponent implements OnInit {

  displayedColumns: string[] = ['name', 'email', 'role', 'actions'];
  dataSource = new MatTableDataSource<any>([]);

  constructor(
    readonly adminService: AdminService,
    readonly snack: SnackbarService,
    readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadPendingUsers();
  }

  loadPendingUsers() {
    this.adminService.getPendingUsers().subscribe(res => {
      this.dataSource.data = res;
      this.cdr.detectChanges();
    });
  }

  approve(userId: number) {
    this.adminService.approveUser(userId).subscribe({
      next: (msg: string) => {
        this.snack.show(msg);
        this.updateStatus(userId, 'Approved');
      },
      error: err => this.snack.show(err.error || 'Approval failed')
    });
  }

  reject(userId: number) {
    this.adminService.rejectUser(userId).subscribe({
      next: (msg: string) => {
        this.snack.show(msg);
        this.updateStatus(userId, 'Rejected');
      },
      error: err => this.snack.show(err.error || 'Rejection failed')
    });
  }

  private updateStatus(userId: number, status: 'Approved' | 'Rejected') {
    const updated = this.dataSource.data.map(u =>
      u.userId === userId ? { ...u, status } : u
    );

    this.dataSource.data = updated;
    this.cdr.detectChanges();
  }
}
