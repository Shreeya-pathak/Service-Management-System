import { InvoiceDialogComponent } from '../../customer/invoice-dialog/invoice-dialog';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';

import { CustomerRequestService } from '../../../core/services/customer/customer-request.service';
import { RequestDetailsDialogComponent } from '../request-details.dialog';

@Component({
  selector: 'app-my-requests',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,   // ✅ REQUIRED
    MatDialogModule,
    MatCardModule,
    MatChipsModule
  ],
  templateUrl: './my-requests.html',
  styleUrls: ['./my-requests.css']
})
export class MyRequestsComponent implements OnInit {

  requests: any[] = [];
  groupedRequests: any[] = [];

  constructor(
    readonly requestService: CustomerRequestService,
    readonly dialog: MatDialog,
    readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests() {
    this.requestService.getMyRequests().subscribe(res => {
      console.log('API RESPONSE:', res);
      this.requests = res;
      this.groupByCategory();
      this.cdr.detectChanges();
    });
  }

  groupByCategory() {
    const map = new Map<string, any[]>();

    this.requests.forEach(r => {
      const category = r.categoryName || 'Other';

      if (!map.has(category)) {
        map.set(category, []);
      }

      map.get(category)!.push(r);
    });

    this.groupedRequests = Array.from(map.entries()).map(
      ([categoryName, requests]) => ({
        categoryName,
        requests,
        expanded: true
      })
    );
  }



  toggle(group: any) {
    group.expanded = !group.expanded;
  }

  openDetails(request: any) {
    const ref = this.dialog.open(RequestDetailsDialogComponent, {
      width: '600px',
      data: request
    });

    ref.afterClosed().subscribe(updated => {
      if (updated) this.loadRequests();
    });
  }

  openInvoice(request: any) {
    this.dialog.open(InvoiceDialogComponent, {
      width: '600px',
      data: { serviceRequestId: request.serviceRequestId }
    });
  }
}
