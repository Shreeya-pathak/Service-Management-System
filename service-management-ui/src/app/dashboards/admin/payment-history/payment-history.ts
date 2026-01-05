import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { PaymentHistoryService } from '../../../core/services/history/payment-history.service';


@Component({
  standalone: true,
  selector: 'app-admin-payment-history',
  imports: [CommonModule, MatTableModule, MatCardModule],
  templateUrl: './payment-history.html',
  styleUrls: ['./payment-history.css']
})
export class AdminPaymentHistoryComponent implements OnInit {

  payments: any[] = [];

  displayedColumns = [
    'paymentId',
    'invoiceId',
    'customer',
    'date',
    'amount',
    'method'
  ];

  constructor(readonly service: PaymentHistoryService,
    readonly cdr:ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadPayments();
  }

  loadPayments() {
    this.service
      .getPaymentHistory()
      .subscribe(res => {
        this.payments= res;
        this.cdr.detectChanges();
      });
      
  }
}
