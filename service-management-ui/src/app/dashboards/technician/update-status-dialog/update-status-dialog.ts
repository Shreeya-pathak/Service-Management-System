import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-update-status-dialog',
  imports: [CommonModule],
  templateUrl: './update-status-dialog.html',
  styleUrls: ['./update-status-dialog.css']
})
export class UpdateStatusDialogComponent {

  status!: 'Assigned' | 'In-Progress' | 'Completed' | 'Closed';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    readonly dialogRef: MatDialogRef<UpdateStatusDialogComponent>
  ) {
    this.status = data.status;
  }

  updateStatus(newStatus: 'In-Progress' | 'Completed') {
    this.status = newStatus;

    this.dialogRef.close({
      status: this.status
    });
  }

  close() {
    this.dialogRef.close(null);
  }

  get isFinalStatus(): boolean {
    return this.status === 'Completed' || this.status === 'Closed';
  }
}
