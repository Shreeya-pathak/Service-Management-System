import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { AdminPaymentService } from '../../../core/services/admin/admin-payment.service';
import { ApprovePaymentDialogComponent } from '../approve-payment-dialog/approve-payment-dialog';


@Component({
  standalone: true,
  selector: 'app-payment-approvals',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule
  ],
  templateUrl: './payment-approvals.html',
  styleUrls: ['./payment-approvals.css']
})
export class PaymentApprovalsComponent implements OnInit {

  invoices: any[] = [];

  constructor(
    readonly paymentService: AdminPaymentService,
    readonly snack: MatSnackBar,
    readonly dialog: MatDialog,
    readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.paymentService
      .getPendingPaymentApprovals()
      .subscribe(res => {
        this.invoices = res;
        this.cdr.detectChanges();
      });
  }

  openApproveDialog(invoice: any) {
    const ref = this.dialog.open(ApprovePaymentDialogComponent, {
      width: '400px',
      data: invoice
    });

    ref.afterClosed().subscribe(done => {
      if (done) {
        this.snack.open('Payment approved successfully', 'OK', {
          duration: 3000
        });
        this.load();
      }
    });
  }
}
