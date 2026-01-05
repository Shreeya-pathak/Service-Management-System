import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminPaymentService } from '../../../core/services/admin/admin-payment.service';
import { MatIconModule } from '@angular/material/icon';
@Component({
  standalone: true,
  selector: 'app-approve-payment-dialog',
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule
  ],
  templateUrl: './approve-payment-dialog.html'
})
export class ApprovePaymentDialogComponent {

  paymentMethod = '';
  isSubmitting = false;

  methods = ['Cash', 'UPI', 'Card', 'Net Banking'];

  constructor(
    @Inject(MAT_DIALOG_DATA) public invoice: any,
    readonly ref: MatDialogRef<ApprovePaymentDialogComponent>,
    readonly paymentService: AdminPaymentService,
    readonly snack: MatSnackBar
  ) {}

  approve() {
    if (!this.paymentMethod) return;
    this.isSubmitting = true;
    this.paymentService
      .approvePayment(this.invoice.invoiceId, {
        paymentMethod: this.paymentMethod
      })
      .subscribe({
        next: () => {
          this.snack.open(
            'Payment approved successfully',
            'OK',
            { duration: 3000 }
          );

          this.ref.close(true); // refresh parent list
        },
        error: () => {
          this.isSubmitting = false; // re-enable on error
          this.snack.open(
            'Failed to approve payment. Try again.',
            'OK',
            { duration: 3000 }
          );
        }
      });
  }
  
}
