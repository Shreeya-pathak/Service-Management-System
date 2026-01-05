import { Component, OnInit, ChangeDetectorRef,AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator,MatPaginatorModule } from '@angular/material/paginator';
import { AdminService } from '../../../core/services/admin/admin.service';
import { SnackbarService } from '../../../shared/snackbar.service';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-approval-pending',
  standalone: true,
  templateUrl: './approval-pending.html',
  styleUrls: ['./approval-pending.css'],
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatCardModule

  ]
})
export class ApprovalPendingComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['name', 'email', 'role', 'actions'];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    readonly adminService: AdminService,
    readonly snack: SnackbarService,
    readonly cdr: ChangeDetectorRef
  ) {}
  
  ngOnInit(): void {
    this.loadPendingUsers();
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
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
