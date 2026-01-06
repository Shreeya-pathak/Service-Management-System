import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { UpdateStatusDialogComponent } from '../update-status-dialog/update-status-dialog';
import { TechnicianService } from '../../../core/services/technician/technician.service';

@Component({
  standalone: true,
  selector: 'app-technician-requests',
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatSnackBarModule,
    MatPaginatorModule
  ],
  templateUrl: './technician-requests.html',
  styleUrls: ['./technician-requests.css']
})
export class TechnicianRequestsComponent implements OnInit {

  displayedColumns = [
    'id',
    'service',
    'category',
    'customer',
    'issueDescription',
    'date',
    'status',
    'update',
    'completedDate'
  ];

  data: any[] = [];
  filteredData: any[] = [];

  statusFilter = '';
  searchText = '';

  pageSize = 5;
  pageIndex = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    readonly techService: TechnicianService,
    readonly snack: MatSnackBar,
    readonly cdr: ChangeDetectorRef,
    readonly dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.techService.getAssignedRequests().subscribe(res => {
      this.data = [...res];
      console.log(this.data);
      this.applyFilters();
      this.cdr.detectChanges();
    });
  }

  applyFilters() {
    const text = this.searchText.toLowerCase();

    this.filteredData = this.data.filter(r =>
      (!this.statusFilter || r.status === this.statusFilter) &&
      (!text ||
        r.customerName.toLowerCase().includes(text) ||
        r.serviceName.toLowerCase().includes(text))
    );

    this.pageIndex = 0;
  }

  get pagedData() {
    const start = this.pageIndex * this.pageSize;
    return this.filteredData.slice(start, start + this.pageSize);
  }

  onPageChange(event: any) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  // ✅ SINGLE SOURCE OF TRUTH FOR STATUS UPDATE
  openUpdateDialog(row: any) {
    const dialogRef = this.dialog.open(UpdateStatusDialogComponent, {
      width: '400px',
      data: {
        status: row.status,
        remarks: row.remarks
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;

      // Call API ONLY if status actually changed OR remarks changed
      this.techService.updateRequestStatus(
        row.serviceRequestId,
        result.status,
        result.remarks
      ).subscribe({
        next: () => {
          row.status = result.status;
          row.remarks = result.remarks;

          if (result.status === 'Completed') {
            row.completedDate = new Date().toISOString().split('T')[0];
          }

          this.cdr.detectChanges();
        },
        error: () => {
          this.snack.open('Failed to update request', 'Close', { duration: 3000 });
        }
      });
    });

  }
}
