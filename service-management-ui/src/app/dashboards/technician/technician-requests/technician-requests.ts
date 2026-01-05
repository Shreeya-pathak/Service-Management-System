import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';

import { TechnicianService } from '../../../core/services/technician/technician.service';

@Component({
  standalone: true,
  selector: 'app-technician-requests',
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatRadioModule,
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
    'date',
    'status',
    'updateStatus',
    'completedDate'
  ];

  data: any[] = [];
  filteredData: any[] = [];

  // filters
  statusFilter = '';
  searchText = '';

  // pagination
  pageSize = 5;
  pageIndex = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    readonly techService: TechnicianService,
    readonly snack: MatSnackBar,
    readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.techService.getAssignedRequests().subscribe(res => {
      this.data = [...res];
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

  updateStatus(row: any, newStatus: 'In-Progress' | 'Completed') {
    if (row.status === newStatus) return;

    this.techService
      .updateRequestStatus(row.serviceRequestId, newStatus)
      .subscribe({
        next: () => {
          row.status = newStatus;

          if (newStatus === 'Completed') {
            row.completedDate = new Date().toISOString().split('T')[0];
          }

          this.cdr.detectChanges();
        },
        error: () => {
          this.snack.open(
            'Failed to update status',
            'Close',
            { duration: 3000 }
          );
        }
      });
  }
}
