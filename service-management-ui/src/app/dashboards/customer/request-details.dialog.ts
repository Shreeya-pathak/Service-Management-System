import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';

import { CustomerRequestService } from '../../core/services/customer/customer-request.service';

@Component({
  standalone: true,
  selector: 'app-request-details-dialog',
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ],
  template: `
<div class="dialog">

  <h2>{{ data.serviceName }}</h2>

  <div class="info">
    <p><b>Category:</b> {{ data.categoryName }}</p>
    <p><b>Priority:</b> {{ data.priority }}</p>
    <p><b>Status:</b> {{ data.status }}</p>
    <p><b>Requested On:</b> {{ data.createdAt }}</p>
    <p>
        <b>Scheduled Date:</b>
        <span *ngIf="hasValidScheduledDate(); else pending">
            {{ data.scheduledDate }}
        </span>
        <ng-template #pending>
            <span class="pending">Pending</span>
        </ng-template>
    </p>

  </div>

  <div class="description">
    <label>Description</label>
    <p class="box">{{ data.issueDescription }}</p>
  </div>

  <div class="actions">
    <button
      mat-stroked-button
      color="warn"
      *ngIf="canCancel()"
      (click)="cancelRequest()">
      Cancel Request
    </button>

    <button mat-raised-button color="primary" (click)="ref.close()">
      Close
    </button>
  </div>

</div>
  `,
  styles: [`
.dialog {
  padding: 20px;
}

.info p {
  margin: 4px 0;
}

.description {
  margin-top: 16px;
}

.box {
  background: #f5f5f5;
  padding: 10px;
  border-radius: 6px;
  margin-top: 4px;
}

.pending {
  color: #ff9800;
  font-weight: 500;
}

.actions {
  display: flex;
  justify-content: space-between;
  margin-top: 24px;
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
        this.snackBar.open(
          'Request cancelled successfully',
          'Close',
          { duration: 3000 }
        );
        this.ref.close(true);
      },
      error: () => {
        this.snackBar.open(
          'Failed to cancel request',
          'Close',
          { duration: 3000 }
        );
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
