import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { ServiceService } from '../../../core/services/service.service';
import { ServiceCategoryService } from '../../../core/services/service-category.service';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './services.html',
  styleUrls: ['./services.css']
})
export class ServicesComponent implements OnInit {

  services: any[] = [];
  categories: any[] = [];

  serviceForm!: FormGroup;     // ✅ MATCHES HTML
  editingId: number | null = null;
  isEditMode = false;

  constructor(
    readonly fb: FormBuilder,
    readonly serviceService: ServiceService,
    readonly categoryService: ServiceCategoryService,
    readonly cdr: ChangeDetectorRef
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
    this.categoryService.getAll().subscribe(res => {
      this.categories = [...res];
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
        }
      });
    } else {
      this.serviceService.create(data).subscribe({
        next: () => {
          this.loadServices();   // ✅ AFTER API SUCCESS
          this.resetForm();
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
}
