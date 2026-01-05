import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

import { ReportsService } from '../../../core/services/servicemanager/service-manager-reports.service';

@Component({
  standalone: true,
  selector: 'app-admin-reports',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    BaseChartDirective
    
  ],
  templateUrl: './manager-reports.html',
  styleUrls: ['./manager-reports.css']
})
export class ManagerReportsComponent implements OnInit {

  /* ---------------- Revenue ---------------- */
  year = new Date().getFullYear();
  month = new Date().getMonth() + 1;
  report: any;

  // -------- Monthly Revenue --------
revenueChartType: ChartType = 'doughnut';

revenueChartData: ChartData<'doughnut'> = {
  labels: ['Revenue', 'Remaining'],
  datasets: [
    {
      data: [],
      backgroundColor: ['#771955ff', '#e0e0e0']
    }
  ]
};


  /* ---------------- Technician Workload ---------------- */
  workloadChartType: ChartType = 'bar';

  workloadChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        label: 'Active Requests',
        data: [],
        backgroundColor: '#ad4eb0ff'
      }
    ]
  };

  constructor(
    readonly reportsService: ReportsService,
    readonly cdr: ChangeDetectorRef
  ) {}

  loadRevenue() {
    this.reportsService
      .getMonthlyRevenue(this.year, this.month)
      .subscribe(res => {
        this.report = res;

        this.revenueChartData.datasets[0].data = [
          res.totalRevenue,
          Math.max(0, 100000 - res.totalRevenue)
        ];

        this.cdr.detectChanges();
      });
  }


  loadTechnicianWorkload() {
    this.reportsService.getTechnicianWorkload().subscribe(res => {

      this.workloadChartData = {
        labels: res.map(x => x.technicianName),
        datasets: [
          {
            label: 'Active Requests',
            data: res.map(x => x.activeRequestCount),
            backgroundColor: '#812276ff'
          }
        ]
      };

      this.cdr.detectChanges();
    });
  }



  ngOnInit() {
    this.loadTechnicianWorkload(); 
  }
  get hasWorkloadData(): boolean {
    return (
      !!this.workloadChartData &&
      Array.isArray(this.workloadChartData.datasets) &&
      this.workloadChartData.datasets.length > 0 &&
      Array.isArray(this.workloadChartData.datasets[0].data) &&
      this.workloadChartData.datasets[0].data.length > 0
    );
  }

}
