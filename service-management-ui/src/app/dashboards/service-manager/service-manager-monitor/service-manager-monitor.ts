import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule, MatFormField } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { ServiceManagerService } from '../../../core/services/servicemanager/service-manager.service';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';

@Component({
  standalone: true,
  selector: 'app-service-manager-monitor',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatChipsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormField,
    MatInputModule,
    MatPaginatorModule
  ],
  templateUrl: './service-manager-monitor.html',
  styleUrls: ['./service-manager-monitor.css']
})
export class ServiceManagerMonitorComponent implements OnInit {

  // DATA
  allRequests: any[] = [];
  requests: any[] = [];
  pageSize = 5;
  pageIndex = 0;

  // FILTERS
  statuses: string[] = ['Pending', 'Assigned', 'In-Progress', 'Completed'];
  categories: string[] = [];
  technicians: string[] = [];

  selectedStatus = '';
  selectedCategory = '';
  selectedTechnician = '';
  fromDate: Date | null = null;
  toDate: Date | null = null;

  // STATS
  stats = {
    pending: 0,
    assigned: 0,
    inProgress: 0,
    completed: 0,
    closed:0
  };

  constructor(
    readonly service: ServiceManagerService,
    readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.service.getMonitorRequests().subscribe(res => {
      this.allRequests = res;
      this.requests = [...res];
      
      this.buildFilters(res);
      this.computeStats(this.requests);
      this.cdr.detectChanges();
    });
  }

  // ---------------- FILTER LOGIC ----------------
  applyFilters() {
    this.requests = this.allRequests.filter(r => {

      if (this.selectedStatus && r.status !== this.selectedStatus) return false;
      if (this.selectedCategory && r.serviceCategory !== this.selectedCategory) return false;
      if (this.selectedTechnician && r.technicianName !== this.selectedTechnician) return false;

      if (this.fromDate && new Date(r.requestedDate) < this.fromDate) return false;
      if (this.toDate && new Date(r.requestedDate) > this.toDate) return false;

      return true;
    });

    this.computeStats(this.requests);
  }

  resetFilters() {
    this.selectedStatus = '';
    this.selectedCategory = '';
    this.selectedTechnician = '';
    this.fromDate = null;
    this.toDate = null;

    this.requests = [...this.allRequests];
    this.computeStats(this.requests);
  }

  // ---------------- HELPERS ----------------
  buildFilters(data: any[]) {
    this.categories = [...new Set(data.map(d => d.serviceCategory))];
    this.technicians = [...new Set(data.map(d => d.technicianName).filter(Boolean))];
  }

  computeStats(data: any[]) {
    this.stats = { pending: 0, assigned: 0, inProgress: 0, completed: 0, closed:0};

    data.forEach(r => {
      if (r.status === 'Pending') this.stats.pending++;
      if (r.status === 'Assigned') this.stats.assigned++;
      if (r.status === 'In-Progress') this.stats.inProgress++;
      if (r.status === 'Completed') this.stats.completed++;
      if (r.status === 'Closed') this.stats.closed++;
    });
  }

  statusClass(status: string) {
    return {
      'status-pending': status === 'Pending',
      'status-assigned': status === 'Assigned',
      'status-progress': status === 'In-Progress',
      'status-completed': status === 'Completed',
      'status-closed': status === 'Closed'
    };
  }
  get pagedRequests() {
    const start = this.pageIndex * this.pageSize;
    return this.requests.slice(start, start + this.pageSize);
  }

  onPageChange(event: any) {
    this.pageIndex = event.pageIndex;
  }
  statusRowClass(status: string) {
  return {
    pending: status === 'Pending',
    assigned: status === 'Assigned',
    inprogress: status === 'In-Progress',
    completed: status === 'Completed',
    closed: status === 'Closed'
  };
}

}
