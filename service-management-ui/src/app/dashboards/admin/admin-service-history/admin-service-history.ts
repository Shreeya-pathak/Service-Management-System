import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { ServiceRequestHistoryService } from '../../../core/services/history/service-request-history.service';

@Component({
  standalone: true,
  selector: 'app-admin-service-history',
  imports: [CommonModule, MatTableModule],
  templateUrl: './admin-service-history.html'
})
export class AdminServiceHistoryComponent implements OnInit {

  data: any[] = [];
  displayedColumns = [
    'id','customer','service','issue','requested','scheduled','completed','status'
  ];

  constructor(readonly service: ServiceRequestHistoryService,
    readonly cdr:ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.service.getAllHistory().subscribe(res => {
        this.data = res;
        this.cdr.detectChanges();
      });
  }
}
