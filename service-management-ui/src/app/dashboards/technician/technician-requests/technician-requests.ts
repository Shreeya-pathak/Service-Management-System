import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TechnicianService } from '../../../core/services/technician/technician.service';

@Component({
  standalone: true,
  selector: 'app-technician-requests',
  imports: [
    CommonModule,
    MatTableModule,
    MatRadioModule,
    MatSnackBarModule
  ],
  templateUrl: './technician-requests.html',
  styleUrls: ['./technician-requests.css']
})
export class TechnicianRequestsComponent implements OnInit {

  displayedColumns = [
    'id',
    'service',
    'category',
    'customer',
    'date',
    'status',
    'updateStatus',
    'completedDate'
  ];

  data: any[] = [];

  constructor(
    readonly techService: TechnicianService,
    readonly snack: MatSnackBar,
    readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.techService.getAssignedRequests().subscribe(res => {
      this.data = [...res];
      this.cdr.detectChanges();
    });
  }

  updateStatus(row: any, newStatus: 'In-Progress' | 'Completed') {
    // Prevent duplicate clicks
    if (row.status === newStatus) return;

    this.techService
      .updateRequestStatus(row.serviceRequestId, newStatus)
      .subscribe({
        next: () => {

          
          row.status = newStatus;
          this.cdr.detectChanges();

          // Optional: set completed date for instant feedback
          if (newStatus === 'Completed' ||  'Closed') {
            row.completedDate = new Date().toISOString().split('T')[0];
          }

        },
        error: () => {
          this.snack.open(
            'Failed to update status',
            'Close',
            { duration: 3000 }
          );
        }
      });
  }




}
