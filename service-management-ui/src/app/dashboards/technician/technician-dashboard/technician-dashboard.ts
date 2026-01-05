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
      this.dashboard = {
        pendingCount: res.pendingCount ?? 0,
        inProgressCount: res.inProgressCount ?? 0,
        completedCount: res.completedCount ?? 0,
        availabilityStatus: res.availabilityStatus ?? 'Unavailable'
      };

      this.loading = false;

      
      Promise.resolve().then(() => this.cdr.detectChanges());
    });
  }


  updateAvailability(status: 'Available' | 'Unavailable') {
    if (this.dashboard.availabilityStatus === status) return;

    this.techService.updateAvailability(status).subscribe({
      next: () => {
        this.dashboard = {
          ...this.dashboard,
          availabilityStatus: status
        };

        // ✅ force UI refresh
        Promise.resolve().then(() => {
          this.cdr.detectChanges();
        });

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
