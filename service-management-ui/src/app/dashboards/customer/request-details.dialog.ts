import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';

import { CustomerRequestService } from '../../core/services/customer/customer-request.service';

@Component({
  standalone: true,
  selector: 'app-request-details-dialog',
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
<div class="dialog">

  <!-- HEADER -->
  <div class="header">
    <mat-icon class="header-icon">build</mat-icon>
    <h2>{{ data.serviceName }}</h2>
  </div>

  <!-- INFO GRID -->
  <div class="info-grid">

    <div class="info-item">
      <mat-icon>category</mat-icon>
      <span><b>Category:</b> {{ data.categoryName }}</span>
    </div>

    <div class="info-item">
      <mat-icon>priority_high</mat-icon>
      <span><b>Priority:</b> {{ data.priority }}</span>
    </div>

    <div class="info-item">
      <mat-icon>info</mat-icon>
      <span>
        <b>Status:</b>
        <span class="status" [class.closed]="data.status === 'Closed'">
          {{ data.status }}
        </span>
      </span>
    </div>

    <div class="info-item">
      <mat-icon>event</mat-icon>
      <span><b>Requested On:</b> {{ data.createdAt }}</span>
    </div>

    <div class="info-item">
      <mat-icon>engineering</mat-icon>
      <span>
        <b>Technician:</b>
        {{ data.technicianName || 'Not Assigned Yet' }}
      </span>
    </div>

    <div class="info-item">
      <mat-icon>schedule</mat-icon>
      <span>
        <b>Scheduled Date:</b>
        <ng-container *ngIf="hasValidScheduledDate(); else pending">
          {{ data.scheduledDate }}
        </ng-container>
        <ng-template #pending>
          <span class="pending">Pending</span>
        </ng-template>
      </span>
    </div>

  </div>

  <!-- DESCRIPTION -->
  <div class="description">
    <label>Description</label>
    <p class="box">{{ data.issueDescription }}</p>
    <p class="box">{{ data.remarks }}</p>
  </div>

  <!-- ACTIONS -->
  <div class="actions">
    <button
      mat-stroked-button
      color="warn"
      *ngIf="canCancel()"
      (click)="cancelRequest()">
      <mat-icon>cancel</mat-icon>
      Cancel Request
    </button>

    <button mat-raised-button color="primary" (click)="ref.close()">
      <mat-icon>close</mat-icon>
      Close
    </button>
  </div>

</div>
  `,
  styles: [`
/* CONTAINER */
.dialog {
  padding: 24px;
  min-width: 520px;
  background: #fff7fb;
  border-radius: 18px;
  font-family: 'Inter', sans-serif;
}

/* HEADER */
.header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.header-icon {
  font-size: 32px;
  color: #8e24aa;
}

h2 {
  margin: 0;
  color: #6a1b9a;
  font-weight: 600;
}

/* INFO GRID */
.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
  margin-bottom: 20px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #ffffff;
  padding: 10px 12px;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
  font-size: 14px;
}

.info-item mat-icon {
  color: #8e24aa;
  font-size: 20px;
}

/* STATUS */
.status {
  padding: 2px 8px;
  border-radius: 12px;
  background: #ede7f6;
  color: #6a1b9a;
  font-weight: 500;
}

.status.closed {
  background: #e8f5e9;
  color: #2e7d32;
}

/* DESCRIPTION */
.description {
  margin-top: 10px;
}

.description label {
  font-weight: 600;
  color: #6a1b9a;
}

.box {
  margin-top: 6px;
  background: #ffffff;
  padding: 12px;
  border-radius: 10px;
  box-shadow: inset 0 0 0 1px #f3e5f5;
}

/* PENDING */
.pending {
  color: #ff9800;
  font-weight: 600;
}

/* ACTIONS */
.actions {
  display: flex;
  justify-content: space-between;
  margin-top: 24px;
}

button mat-icon {
  margin-right: 6px;
}
  `]
})
export class RequestDetailsDialogComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public ref: MatDialogRef<RequestDetailsDialogComponent>,
    readonly service: CustomerRequestService,
    readonly snackBar: MatSnackBar
  ) {}

  canCancel(): boolean {
    return this.data.status === 'Pending';
  }

  cancelRequest() {
    this.service.cancelRequest(this.data.serviceRequestId).subscribe({
      next: () => {
        this.snackBar.open('Request cancelled successfully', 'Close', {
          duration: 3000
        });
        this.ref.close(true);
      },
      error: () => {
        this.snackBar.open('Failed to cancel request', 'Close', {
          duration: 3000
        });
      }
    });
  }

  hasValidScheduledDate(): boolean {
    return (
      this.data.scheduledDate &&
      this.data.scheduledDate !== '0001-01-01'
    );
  }
}
