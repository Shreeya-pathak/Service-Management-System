import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ChartData, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

import { ServiceManagerService } from '../../../core/services/servicemanager/service-manager.service';
import { ReportsService } from '../../../core/services/servicemanager/service-manager-reports.service';

@Component({
  standalone: true,
  selector: 'app-service-manager-dashboard',
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    BaseChartDirective
  ],
  templateUrl: './service-manager-dashboard.html',
  styleUrls: ['./service-manager-dashboard.css']
})
export class ServiceManagerDashboardComponent implements OnInit {

  data: any;
  loading = true;

  // KPIs
  avgResolutionDays = 0;

  // Charts
  statusChartType = 'doughnut' as const;
  categoryChartType = 'doughnut' as const;
  

  statusChartData!: ChartData<'doughnut'>;
  categoryChartData!: ChartData<'doughnut'>;
  
  workloadChartType = 'bar' as const;
  workloadChartData!: ChartData<'bar'>;



  chartOptions: ChartOptions<'doughnut'> = {
    cutout: '70%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 18,
          boxWidth: 14,
          font: { size: 13}
        }
      }
    }
  };
  workloadChartOptions: ChartOptions<'bar'> = {
    indexAxis: 'y', // 👈 THIS makes it horizontal
    responsive: true,
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };



  constructor(
    readonly service: ServiceManagerService,
    readonly reports: ReportsService,
    readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadDashboardStats();
    this.loadReports();
  }

  loadDashboardStats() {
    this.service.getDashboard().subscribe(res => {
      this.data = res;
      this.loading = false;
      this.cdr.detectChanges();
    });
  }

  loadReports() {

    // Avg Resolution Time
    this.reports.getAverageResolutionTime().subscribe(res => {
      this.avgResolutionDays = res.averageDays;
      this.cdr.detectChanges();
    });

    // Requests by Status
    this.reports.getRequestsByStatus().subscribe(res => {
      this.statusChartData = {
        labels: res.map(x => x.status),
        datasets: [{
          data: res.map(x => x.count),
          backgroundColor: [
            '#7b1fa2',
            '#ec407a',
            '#ba68c8',
            '#66bb6a',
            '#ffa726'
          ]
        }]
      };
      this.cdr.detectChanges();
    });

    // Requests by Category
    this.reports.getRequestsByCategory().subscribe(res => {
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
          ]
        }]
      };
      this.cdr.detectChanges();
    });

    // Technician Workload
    this.reports.getTechnicianWorkload().subscribe(res => {

    // 🔹 Sort technicians by workload (descending)
    const sorted = [...res].sort(
      (a, b) => b.activeRequestCount - a.activeRequestCount
    );

    this.workloadChartData = {
      labels: sorted.map(x => x.technicianName),
        datasets: [{
          label: 'Active Requests',
          data: sorted.map(x => x.activeRequestCount),
          backgroundColor: sorted.map(x =>
            x.activeRequestCount >= 6 ? '#ef5350' :   // overloaded
            x.activeRequestCount >= 3 ? '#ffa726' :   // moderate
                                      '#66bb6a'     // free
          ),
          borderRadius: 8,
          barThickness: 18
        }]
      };

      this.cdr.detectChanges();
    });


  }
}
