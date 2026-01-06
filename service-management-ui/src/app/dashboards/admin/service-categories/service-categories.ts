import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import {  MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { Component, OnInit, ChangeDetectorRef ,ViewChild, AfterViewInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { MatSlideToggleModule,MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ServiceCategoryService } from '../../../core/services/admin/service-category.service';

@Component({
  selector: 'app-service-categories',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,MatSlideToggleModule,MatPaginator,MatIconModule,MatTableModule,MatInputModule,MatFormFieldModule,MatButtonModule,MatCardModule],
  templateUrl: './service-categories.html',
  styleUrls: ['./service-categories.css']
})
export class ServiceCategoriesComponent implements OnInit,AfterViewInit {
  pageSize = 5;
  pageIndex = 0;
  categories: any[] = [];
  displayedColumns = ['category', 'actions'];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  categoryForm!: FormGroup;    
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
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  loadCategories() {
    this.categoryService.getAll().subscribe(res => {
      this.categories = [...res];
      this.dataSource.data = this.categories;
      this.cdr.detectChanges();
    });
  }

  submit() {
    if (this.categoryForm.invalid) return;

    const data = this.categoryForm.value;

    if (this.editingId) {
      this.categoryService.update(this.editingId, data).subscribe({
        next: () => {
          this.loadCategories(); 
          this.resetForm();
        }
      });
    } else {
      this.categoryService.create(data).subscribe({
        next: () => {
          this.loadCategories(); 
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

  

  onToggleCategory(category: any, event: MatSlideToggleChange) {
    const previousValue = category.isActive;

    
    category._loading = true;

    const request$ = event.checked
      ? this.categoryService.enable(category.serviceCategoryId)
      : this.categoryService.disable(category.serviceCategoryId);

    request$.subscribe({
      next: () => {
        
        category.isActive = event.checked;
        category._loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        
        category.isActive = previousValue;
        category._loading = false;
      }
    });
  }

  get pagedCategories() {
    const start = this.pageIndex * this.pageSize;
    return this.categories.slice(start, start + this.pageSize);
  }

  onPageChange(event: any) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }


}
