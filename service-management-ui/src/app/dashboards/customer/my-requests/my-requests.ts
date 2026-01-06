import { InvoiceDialogComponent } from '../../customer/invoice-dialog/invoice-dialog';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableDataSource } from '@angular/material/table';

import { CustomerRequestService } from '../../../core/services/customer/customer-request.service';
import { RequestDetailsDialogComponent } from '../request-details.dialog';

@Component({
  selector: 'app-my-requests',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,   
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
  dataSource = new MatTableDataSource<any>([]);
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
      
      this.requests = [...res];
      this.groupByCategory();
      this.cdr.detectChanges();
    });
  }

groupByCategory() {
  const map = new Map<string, any>();

  
  this.requests.forEach(r => {
    const category = r.categoryName || 'Other';

    
    if (!map.has(category)) {
      map.set(category, {
        categoryName: category,
        requests: [],
        expanded: true
      });
    }

    // Push requests in backend order (already newest → oldest)
    map.get(category).requests.push(r);
  });

  // Preserve insertion order (Map keeps order of first appearance)
  this.groupedRequests = Array.from(map.values());
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
    }).afterClosed().subscribe(paid => {
      if (paid) {
        
        this.requests = this.requests.map(r =>
          r.serviceRequestId === request.serviceRequestId
            ? { ...r, status: 'Closed' }
            : r
        );
      }
    });
  }


}


