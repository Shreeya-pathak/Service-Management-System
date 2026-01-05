import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';

import { CustomerRequestService } from '../../../core/services/customer/customer-request.service';

@Component({
  selector: 'app-raise-request',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  templateUrl: './raise-request.html',
  styleUrls: ['./raise-request.css']
})
export class RaiseRequestComponent implements OnInit {

  form!: FormGroup;

  categories: any[] = [];
  services: any[] = [];

  isSubmitting = false;

  constructor(
    readonly fb: FormBuilder,
    readonly requestService: CustomerRequestService,
    readonly snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.loadCategories();
  }

  buildForm() {
    this.form = this.fb.group({
      serviceCategoryId: ['', Validators.required],
      serviceId: ['', Validators.required],
      issueDescription: ['', [Validators.required, Validators.minLength(10)]],
      priority: ['General', Validators.required]
    });
  }

  // ✅ ACTIVE CATEGORIES ONLY
  loadCategories() {
    this.requestService.getActiveCategories().subscribe({
      next: res => {
        this.categories = res;
      }
    });
  }

  // ✅ ACTIVE SERVICES ONLY
  onCategoryChange(categoryId: number) {
    this.services = [];
    this.form.patchValue({ serviceId: '' });

    if (!categoryId) return;

    this.requestService.getActiveServicesByCategory(categoryId).subscribe({
      next: res => {
        this.services = res;
      }
    });
  }

  submit() {
    if (this.form.invalid || this.isSubmitting) return;

    this.isSubmitting = true;

    const payload = {
      serviceId: this.form.value.serviceId,
      issueDescription: this.form.value.issueDescription,
      priority: this.form.value.priority,
      requestedDate: this.getTodayDate()
    };

    this.requestService.createRequest(payload).subscribe({
      next: () => {
        this.form.reset({ priority: 'General' });
        this.services = [];
        this.isSubmitting = false;
        this.snackBar.open(
          'Service request submitted successfully',
          'View',
          {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'bottom',
            panelClass: ['success-snackbar']
          }
        );

      },
      error: () => {
        this.isSubmitting = false;
        this.snackBar.open(
          'Selected service is no longer available',
          'Dismiss',
          {
            duration: 3500,
            horizontalPosition: 'right',
            verticalPosition: 'bottom',
            panelClass: ['error-snackbar']
          }
        );


      }
    });
  }

  private getTodayDate(): string {
    return new Date().toISOString().split('T')[0]; // yyyy-MM-dd
  }
}
