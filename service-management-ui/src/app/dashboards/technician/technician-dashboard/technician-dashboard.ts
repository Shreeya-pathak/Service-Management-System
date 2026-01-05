import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { TechnicianService } from '../../../core/services/technician/technician.service';

@Component({
  standalone: true,
  selector: 'app-technician-dashboard',
  imports: [
    CommonModule,
    MatCardModule,
    MatRadioModule,
    MatSnackBarModule
  ],
  templateUrl: './technician-dashboard.html',
  styleUrls: ['./technician-dashboard.css']
})
export class TechnicianDashboardComponent implements OnInit {

  dashboard: any;
  loading = true;

  constructor(
    readonly techService: TechnicianService,
    readonly snack: MatSnackBar,
    readonly cdr:ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard() {
    this.techService.getDashboard().subscribe(res => {
      this.dashboard = res;
      this.loading = false;
      this.cdr.detectChanges();
    });
  }

  updateAvailability(status: 'Available' | 'Unavailable') {
    if (this.dashboard.availabilityStatus === status) return;

    this.techService.updateAvailability(status).subscribe({
      next: () => {
        this.dashboard.availabilityStatus = status;

        this.snack.open(
          `Status set to ${status}`,
          'Close',
          { duration: 2000 }
        );
      },
      error: () => {
        this.snack.open(
          'Failed to update availability',
          'Close',
          { duration: 3000 }
        );
      }
    });
  }
}
