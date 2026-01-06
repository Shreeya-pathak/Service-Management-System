import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AdminService } from '../../../core/services/admin/admin.service';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';

import { UserManagementService } from '../../../core/services/admin/user-management.service';

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
  pendingApprovals = 0;

  
  customers = 0;
  technicians = 0;
  serviceManagers = 0;
  
  
  roleChartData!: ChartData<'bar'>;
  roleChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: {
        ticks: { color: '#6a1b9a' }
      },
      y: {
        beginAtZero: true,
        ticks: { color: '#6a1b9a' }
      }
    }
  };

  constructor(
    readonly userService: UserManagementService,
    readonly router: Router,
    readonly cdr: ChangeDetectorRef,
    readonly adminService: AdminService
  ) {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => this.loadStats());
  }

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.userService.getAll().subscribe(users => {

      this.totalUsers = users.length;
      this.activeUsers = users.filter(u => u.isActive).length;
      this.disabledUsers = users.filter(u => !u.isActive).length;

      this.customers = 0;
      this.technicians = 0;
      this.serviceManagers = 0;
      

      users.forEach(u => {
        switch (u.roleName) {
          case 'Customer': this.customers++; break;
          case 'Technician': this.technicians++; break;
          case 'ServiceManager': this.serviceManagers++; break;
          
        }
      });

      this.roleChartData = {
        labels: ['Customers', 'Technicians', 'Service Managers'],
        datasets: [{
          data: [
            this.customers,
            this.technicians,
            this.serviceManagers,
            
          ],
          backgroundColor: [
            '#7b1fa2',
            '#8e24aa',
            '#ab47bc'
          ],
          borderRadius: 8
        }]
      };

      this.cdr.detectChanges();
    });
    this.adminService.getPendingUsers().subscribe(res => {
      this.pendingApprovals = res.length;
      this.cdr.detectChanges();
    });
  }

  goTo(path: string): void {
    this.router.navigate([path]);
  }
}
