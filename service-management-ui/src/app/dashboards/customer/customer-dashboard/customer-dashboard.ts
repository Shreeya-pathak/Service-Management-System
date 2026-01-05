import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { CustomerRequestService } from '../../../core/services/customer/customer-request.service';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './customer-dashboard.html',
  styleUrls: ['./customer-dashboard.css']
})
export class CustomerDashboardComponent implements OnInit {

  total = 0;
  active = 0;
  completed = 0;
  cancelled = 0;

  constructor(readonly requestService: CustomerRequestService) {}

  ngOnInit(): void {
    this.loadSummary();
  }

  loadSummary() {
    this.requestService.getMyRequests().subscribe(requests => {
      this.total = requests.length;
      this.active = requests.filter(r =>
        r.status === 'Pending' ||
        r.status === 'Assigned' ||
        r.status === 'InProgress' ||
        r.status === 'Rescheduled'
      ).length;

      this.completed = requests.filter(r => r.status === 'Completed').length;
      this.cancelled = requests.filter(r => r.status === 'Cancelled').length;
    });
  }
}
