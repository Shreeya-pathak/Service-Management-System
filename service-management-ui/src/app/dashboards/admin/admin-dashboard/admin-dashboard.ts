import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router,NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AdminService } from '../../../core/services/admin/admin.service';
import { UserManagementService } from '../../../core/services/admin/user-management.service';
import { ChartData, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { AdminReportsService } from '../../../core/services/admin/admin-reports.service';
import { AdminPaymentService } from '../../../core/services/admin/admin-payment.service';
@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    BaseChartDirective
  ],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboardComponent implements OnInit {

  totalUsers = 0;
  activeUsers = 0;
  disabledUsers = 0;
  pendingCount = 0;

  // KPIs
  avgResolutionDays = 0;
  pendingPayments = 0;

  // Charts
  // Charts
  statusChartType = 'doughnut' as const;
  categoryChartType = 'doughnut' as const;



  statusChartData!: ChartData<'doughnut'>;
  categoryChartData!: ChartData<'doughnut'>;
  chartOptions: ChartOptions<'doughnut'> = {
    cutout: '70%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 18,
          boxWidth: 14,
          font: {
            size: 13
          }
        }
      }
    }
  };



  constructor(
    readonly userService: UserManagementService,
    readonly reportsService: AdminReportsService, 
    readonly router: Router,
    readonly adminService: AdminService,
    readonly cdr:ChangeDetectorRef,
    readonly paymentService: AdminPaymentService
  ) {
    this.router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe(() => {
      this.loadStats();
    });
  }

  ngOnInit(): void {
    this.loadStats();
    this.loadAnalytics();

  }

  loadStats() {
    this.userService.getAll().subscribe(res => {

      const users = [...res];

      this.totalUsers = users.length;
      this.activeUsers = users.filter(u => u.isActive).length;
      this.disabledUsers = users.filter(u => !u.isActive).length;

      this.cdr.detectChanges();
    });

    
    this.adminService.getPendingUsers().subscribe(res => {
      this.pendingCount = res.length;
      this.cdr.detectChanges();
    });
  }
  loadAnalytics() {

  // Avg resolution time
  this.reportsService.getAverageResolutionTime().subscribe(res => {
    this.avgResolutionDays = res.averageDays;
    this.cdr.detectChanges();
  });

  // Requests by status
   this.reportsService.getRequestsByStatus().subscribe(res => {
  this.statusChartData = {
    labels: res.map(x => x.status),
    datasets: [{
      data: res.map(x => x.count),
      backgroundColor: [
        '#7b1fa2', // Requested
        '#ec407a', // Assigned
        '#ba68c8', // In Progress
        '#66bb6a', // Completed
        '#ef5350'  // Closed
      ],
      borderWidth: 0
    }]
  };
  this.cdr.detectChanges();
});


  // Requests by category
  this.reportsService.getRequestsByCategory().subscribe(res => {
  this.categoryChartData = {
    labels: res.map(x => x.categoryName),
    datasets: [{
      data: res.map(x => x.count),
      backgroundColor: [
        '#7b1fa2',
        '#ec407a',
        '#ba68c8',
        '#ffa726',
        '#66bb6a',
        '#ef5350'
      ],
      borderWidth: 0
    }]
  };
  this.cdr.detectChanges();
});


  // Pending payments
  this.paymentService.getPendingPaymentApprovals().subscribe(res => {
    this.pendingPayments = res.length;
    this.cdr.detectChanges();
  });
}




  goTo(path: string) {
    this.router.navigate([path]);
  }
}
