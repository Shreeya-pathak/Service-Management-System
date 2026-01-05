import { Component, Inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomerRequestService } from '../../../core/services/customer/customer-request.service';

@Component({
  standalone: true,
  selector: 'app-invoice-dialog',
  imports: [
    CommonModule,
    MatButtonModule
  ],
  templateUrl: './invoice-dialog.html',
  styleUrls: ['./invoice-dialog.css']
})
export class InvoiceDialogComponent implements OnInit {

  invoice: any = null;
  loading = true;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { serviceRequestId: number },

    readonly requestService: CustomerRequestService,
    readonly snackBar: MatSnackBar,
    readonly dialogRef: MatDialogRef<InvoiceDialogComponent>,
    readonly cdr:ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadInvoice();
  }

  // 🔹 Fetch invoice details
  loadInvoice(): void {
    this.requestService
      .getInvoiceByServiceRequest(this.data.serviceRequestId)
      .subscribe({
        next: (res) => {
          console.log('INVOICE DATA =>', res); 
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

  // 🔹 Customer clicks "Make Payment"
  makePayment(): void {
    if (!this.invoice) return;

    this.requestService
      .makePayment(this.invoice.invoiceId)
      .subscribe({
        next: () => {
          // update UI immediately
          this.invoice.paymentStatus = 'WaitingForAdminApproval';

          this.snackBar.open(
            'Payment request sent. Waiting for admin approval.',
            'OK',
            { duration: 4000 }
          );
        },
        error: () => {
          this.snackBar.open(
            'Failed to submit payment request',
            'Close',
            { duration: 3000 }
          );
        }
      });
  }

  // 🔹 Optional close action
  close(): void {
    this.dialogRef.close(true);
  }
}
