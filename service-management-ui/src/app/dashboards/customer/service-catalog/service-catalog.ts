import { Component, OnInit ,ChangeDetectorRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

import { CustomerRequestService } from '../../../core/services/customer/customer-request.service';

@Component({
  selector: 'app-service-catalog',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatGridListModule,
    MatIconModule,
    MatExpansionModule,
    MatButtonModule
  ],
  templateUrl: './service-catalog.html',
  styleUrls: ['./service-catalog.css']
})
export class ServiceCatalogComponent implements OnInit {

  categories: any[] = [];
  servicesMap: { [key: number]: any[] } = {};
  loadingCategoryId: number | null = null;

  constructor(
    private readonly service: CustomerRequestService,
    private readonly router: Router,
    private readonly cdr:ChangeDetectorRef
    
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    this.service.getActiveCategories().subscribe(res => {
      this.categories = [...res];
      this.cdr.detectChanges();
    }
  

    );
  }

  loadServices(categoryId: number) {
    if (this.servicesMap[categoryId]) return;

    this.loadingCategoryId = categoryId;

    this.service.getActiveServicesByCategory(categoryId).subscribe({
      next: res => {
        this.servicesMap[categoryId] = res;
        this.loadingCategoryId = null;
        this.cdr.detectChanges();
      },
      error: () => this.loadingCategoryId = null
    });
  }

  bookService(service: any) {
    this.router.navigate(
      ['/customer/raise-request'],
      { queryParams: { serviceId: service.serviceId } }
    );
  }

  getIcon(categoryName: string): string {
    const map: any = {
      Installation: 'build',
      Repair: 'handyman',
      Maintenance: 'settings'
    };
    return map[categoryName] || 'miscellaneous_services';
  }
}
