import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { ServiceCategoryService } from '../../../core/services/service-category.service';

@Component({
  selector: 'app-service-categories',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './service-categories.html',
  styleUrls: ['./service-categories.css']
})
export class ServiceCategoriesComponent implements OnInit {

  categories: any[] = [];

  categoryForm!: FormGroup;    // ✅ MATCHES HTML
  editingId: number | null = null;
  isEditMode = false;

  constructor(
    readonly fb: FormBuilder,
    readonly categoryService: ServiceCategoryService,
    readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.categoryForm = this.fb.group({
      categoryName: ['', Validators.required]
    });

    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getAll().subscribe(res => {
      this.categories = [...res];
      this.cdr.detectChanges();
    });
  }

  submit() {
    if (this.categoryForm.invalid) return;

    const data = this.categoryForm.value;

    if (this.editingId) {
      this.categoryService.update(this.editingId, data).subscribe({
        next: () => {
          this.loadCategories(); // ✅ AFTER API SUCCESS
          this.resetForm();
        }
      });
    } else {
      this.categoryService.create(data).subscribe({
        next: () => {
          this.loadCategories(); // ✅ AFTER API SUCCESS
          this.resetForm();
        }
      });
    }
  }


  edit(category: any) {
    this.editingId = category.serviceCategoryId;
    this.isEditMode = true;

    this.categoryForm.patchValue({
      categoryName: category.categoryName
    });
  }

  resetForm() {
    this.categoryForm.reset();
    this.editingId = null;
    this.isEditMode = false;
  }
}
