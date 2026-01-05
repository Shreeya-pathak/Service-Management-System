import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { ServiceRequestHistoryService } from '../../../core/services/history/service-request-history.service';
import { FormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';

@Component({
  standalone: true,
  selector: 'app-admin-service-history',
  imports: [CommonModule, MatTableModule,FormsModule,MatPaginatorModule],
  templateUrl: './admin-service-history.html'
})
export class AdminServiceHistoryComponent implements OnInit {

  data: any[] = [];
  filteredData: any[] = [];
  pagedData: any[] = [];

  searchText = '';
  pageSize = 5;
  pageIndex = 0;

  displayedColumns = [
    'id','customer','service','issue','requested','scheduled','completed','status'
  ];

  constructor(
    readonly service: ServiceRequestHistoryService
  ) {}

  ngOnInit() {
    this.service.getAllHistory().subscribe(res => {
      this.data = res;
      this.applyFilter(); // ✅ auto load
    });
  }

  applyFilter() {
    const text = this.searchText.toLowerCase();

    this.filteredData = this.data.filter(r =>
      r.customerName.toLowerCase().includes(text) ||
      r.serviceName.toLowerCase().includes(text) ||
      r.status.toLowerCase().includes(text)
    );

    this.pageIndex = 0;
    this.applyPagination();
  }

  applyPagination() {
    const start = this.pageIndex * this.pageSize;
    this.pagedData = this.filteredData.slice(start, start + this.pageSize);
  }

  onPageChange(event: any) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.applyPagination();
  }

  getCompletedDateLabel(r: any): string {
    return r.completedDate
      ? new Date(r.completedDate).toDateString()
      : 'Not Completed';
  }
}
