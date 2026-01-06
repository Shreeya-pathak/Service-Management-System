import { Component, Inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomerRequestService } from '../../../core/services/customer/customer-request.service';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';

@Component({
  standalone: true,
  selector: 'app-invoice-dialog',
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    MatSelectModule
  ],
  templateUrl: './invoice-dialog.html',
  styleUrls: ['./invoice-dialog.css']
})
export class InvoiceDialogComponent implements OnInit {

  invoice: any = null;
  loading = true;

  paymentMethod = ''; // ✅ NEW

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { serviceRequestId: number },

    readonly requestService: CustomerRequestService,
    readonly snackBar: MatSnackBar,
    readonly dialogRef: MatDialogRef<InvoiceDialogComponent>,
    readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadInvoice();
  }

  
  loadInvoice(): void {
    this.requestService
      .getInvoiceByServiceRequest(this.data.serviceRequestId)
      .subscribe({
        next: (res) => {
          this.invoice = res;
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.loading = false;
          this.snackBar.open(
            'Failed to load invoice',
            'Close',
            { duration: 3000 }
          );
        }
      });
  }

  
  makePayment(): void {
    if (!this.invoice) return;

    if (!this.paymentMethod) {
      this.snackBar.open(
        'Please select a payment method',
        'Close',
        { duration: 3000 }
      );
      return;
    }

    this.requestService
      .makePayment(this.invoice.invoiceId, this.paymentMethod)
      .subscribe({
        next: () => {
          
          this.invoice.paymentStatus = 'Paid';

          this.snackBar.open(
            'Payment successful',
            'OK',
            { duration: 3000 }
          );

          this.cdr.detectChanges();
        },
        error: () => {
          this.snackBar.open(
            'Payment failed',
            'Close',
            { duration: 3000 }
          );
        }
      });
  }

  close(): void {
    this.dialogRef.close(true);
  }
}
