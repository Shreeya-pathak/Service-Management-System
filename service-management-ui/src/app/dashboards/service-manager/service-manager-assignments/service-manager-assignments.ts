import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule
} from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';

import { ServiceManagerService } from '../../../core/services/servicemanager/service-manager.service';

@Component({
  standalone: true,
  selector: 'app-service-manager-assignments',
  imports: [
    CommonModule,
    ReactiveFormsModule,

    // Material
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatCardModule,
    MatSnackBarModule,
    MatInputModule
  ],
  templateUrl: './service-manager-assignments.html',
  styleUrls: ['./service-manager-assignments.css']
})
export class ServiceManagerAssignmentsComponent implements OnInit {

  requests: any[] = [];
  technicians: any[] = [];
  expandedId: number | null = null;
  
  forms = new Map<number, FormGroup>();

  constructor(
    readonly service: ServiceManagerService,
    readonly fb: FormBuilder,
    readonly snack: MatSnackBar,
    readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  // ==========================
  // LOAD DATA
  // ==========================
  loadData() {
    this.service.getRequests().subscribe(reqs => {
      // ONLY Pending requests
      this.requests = reqs.filter(r => r.status === 'Pending');

      // 🔥 CRITICAL
      this.buildForms(this.requests);

      this.cdr.detectChanges();
    });

    this.service.getAvailableTechnicians().subscribe(t => {
      this.technicians = t;
    });
  }

  // ==========================
  // BUILD FORMS
  // ==========================
  buildForms(reqs: any[]) {
    this.forms.clear();

    reqs.forEach(r => {
      this.forms.set(
        r.serviceRequestId,
        this.fb.group({
          scheduledDate: [null],
          technicianId: [null]
        })
      );
    });
  }

  // ==========================
  // ASSIGN TECHNICIAN
  // ==========================
  assign(requestId: number) {
    const form = this.forms.get(requestId);
    if (!form || form.invalid) return;

    const { technicianId, scheduledDate } = form.value;

    this.service.assignTechnician(
      requestId,
      technicianId,
      this.formatDateOnly(scheduledDate)
    ).subscribe({
      next: () => {
        // Remove from UI
        this.requests = this.requests.filter(
          r => r.serviceRequestId !== requestId
        );
        this.forms.delete(requestId);

        this.snack.open(
          'Technician assigned successfully',
          'Close',
          { duration: 3000 }
        );

        this.cdr.detectChanges();
      },
      error: () => {
        this.snack.open(
          'Failed to assign technician',
          'Close',
          { duration: 3000 }
        );
      }
    });
  }

  // ==========================
  // DATE FORMATTER
  // ==========================
  formatDateOnly(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  toggleExpand(id: number) {
    this.expandedId = this.expandedId === id ? null : id;
  }
}
