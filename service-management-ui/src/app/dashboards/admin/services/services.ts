import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,FormsModule
} from '@angular/forms';

import { ServiceService } from '../../../core/services/admin/service.service';
import { ServiceCategoryService } from '../../../core/services/admin/service-category.service';
import { MatSlideToggleModule,MatSlideToggleChange } from '@angular/material/slide-toggle';
import { CustomerRequestService } from '../../../core/services/customer/customer-request.service';
@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,MatSlideToggleModule,FormsModule],
  templateUrl: './services.html',
  styleUrls: ['./services.css']
})
export class ServicesComponent implements OnInit {

  services: any[] = [];
  categories: any[] = [];
  searchCategory = '';

  serviceForm!: FormGroup;     // ✅ MATCHES HTML
  editingId: number | null = null;
  isEditMode = false;

  constructor(
    readonly fb: FormBuilder,
    readonly serviceService: ServiceService,
    readonly categoryService: ServiceCategoryService,
    readonly cdr: ChangeDetectorRef,
    readonly requestService: CustomerRequestService
  ) {}

  ngOnInit(): void {
    this.serviceForm = this.fb.group({
      serviceName: ['', Validators.required],
      price: ['', Validators.required],
      slaHours: ['', Validators.required],
      description: [''],
      serviceCategoryId: ['', Validators.required]
    });

    this.loadServices();
    this.loadCategories();
  }

  loadServices() {
    this.serviceService.getAll().subscribe(res => {
      this.services = [...res];
      this.cdr.detectChanges(); 
    });
  }

  loadCategories() {
    this.requestService.getActiveCategories().subscribe({
      next: res => {
        this.categories = res;
        this.cdr.detectChanges(); 
      }
    });
  }

  submit() {
    if (this.serviceForm.invalid) return;

    const data = this.serviceForm.value;

    if (this.editingId) {
      this.serviceService.update(this.editingId, data).subscribe({
        next: () => {
          this.loadServices();   // ✅ AFTER API SUCCESS
          this.resetForm();
          this.cdr.detectChanges(); 
        }
      });
    } else {
      this.serviceService.create(data).subscribe({
        next: () => {
          this.loadServices();   // ✅ AFTER API SUCCESS
          this.resetForm();
          this.cdr.detectChanges(); 
        }
      });
    }
  }


  edit(service: any) {
    this.editingId = service.serviceId;
    this.isEditMode = true;

    this.serviceForm.patchValue({
      serviceName: service.serviceName,
      price: service.price,
      slaHours: service.slaHours,
      description: service.description,
      serviceCategoryId: service.serviceCategoryId
    });
  }

  resetForm() {
    this.serviceForm.reset();
    this.editingId = null;
    this.isEditMode = false;
  }

  onToggleService(service: any, event: MatSlideToggleChange) {
    const previousValue = service.isActive;

    service._loading = true;

    const request$ = event.checked
      ? this.serviceService.enable(service.serviceId)
      : this.serviceService.disable(service.serviceId);

    request$.subscribe({
      next: () => {
        service.isActive = event.checked;
        service._loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        service.isActive = previousValue;
        service._loading = false;
        this.cdr.detectChanges(); 
      }
    });
  }
  get groupedServices() {
  const map = new Map<string, any[]>();

  for (const s of this.services) {

    
    if (
      this.searchCategory &&
      !s.serviceName
        .toLowerCase()
        .includes(this.searchCategory.toLowerCase())
    ) {
      continue;
    }

    if (!map.has(s.categoryName)) {
      map.set(s.categoryName, []);
    }

    map.get(s.categoryName)!.push(s);
  }

  return Array.from(map.entries()).map(
    ([categoryName, services]) => ({
      categoryName,
      services
    })
  );
}



}
