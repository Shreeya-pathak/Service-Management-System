import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { ServiceRequestHistoryService } from '../../../core/services/history/service-request-history.service';

@Component({
  standalone: true,
  selector: 'app-customer-service-history',
  imports: [CommonModule, MatTableModule],
  templateUrl: './customer-service-history.html'
})
export class CustomerServiceHistoryComponent implements OnInit {

  data: any[] = [];
  displayedColumns = [
    'id','service','issue','requested','scheduled','completed','status'
  ];

  constructor(
    readonly service: ServiceRequestHistoryService,
    readonly cdr:ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.service.getMyHistory().subscribe(res => 
      {
        this.data = res;
        this.cdr.detectChanges();
      });
      
  }
}
