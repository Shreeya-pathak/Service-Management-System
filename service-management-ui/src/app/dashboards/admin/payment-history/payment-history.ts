import { Component, OnInit ,ChangeDetectorRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PaymentHistoryService } from '../../../core/services/history/payment-history.service';

@Component({
  standalone: true,
  selector: 'app-admin-payment-history',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './payment-history.html',
  styleUrls: ['./payment-history.css']
})
export class AdminPaymentHistoryComponent implements OnInit {

  payments: any[] = [];
  groupedPayments: { [key: string]: any[] } = {};
  searchText = '';

  constructor(
    readonly service: PaymentHistoryService,
    readonly cdr:ChangeDetectorRef
  ) {}

  ngOnInit(): void {
  this.service.getPaymentHistory().subscribe(res => {
    this.payments = res;
    this.applyFilter();

    // ✅ FORCE UI UPDATE
    Promise.resolve().then(() => {
      this.cdr.detectChanges();
    });
  });
}


  applyFilter() {
    const text = this.searchText.toLowerCase();

    const filtered = this.payments.filter(p =>
      p.customerName?.toLowerCase().includes(text) ||
      p.invoiceId?.toString().includes(text)
    );

    this.groupedPayments = {};

    filtered.forEach(p => {
      const method = p.paymentMethod || 'Other';
      if (!this.groupedPayments[method]) {
        this.groupedPayments[method] = [];
      }
      this.groupedPayments[method].push(p);
    });
  }
}
