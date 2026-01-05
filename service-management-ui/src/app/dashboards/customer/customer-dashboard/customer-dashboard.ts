import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CustomerRequestService } from '../../../core/services/customer/customer-request.service';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './customer-dashboard.html',
  styleUrls: ['./customer-dashboard.css']
})
export class CustomerDashboardComponent implements OnInit {

  total = 0;
  active = 0;
  completed = 0;
  cancelled = 0;

  constructor(readonly requestService: CustomerRequestService,
    readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadSummary();
  }

  loadSummary() {
    this.requestService.getMyRequests().subscribe(requests => {
      this.total = requests.length;

      this.active = requests.filter(r =>
        ['Pending', 'Assigned', 'InProgress', 'Rescheduled'].includes(r.status)
      ).length;

      
      this.completed = requests.filter(r =>
        ['Completed', 'Closed'].includes(r.status)
      ).length;

      this.cancelled = requests.filter(r =>
        r.status === 'Cancelled'
      ).length;

      this.cdr.detectChanges();
    });
  }
}
