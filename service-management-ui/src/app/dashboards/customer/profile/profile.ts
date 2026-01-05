import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';

import { ProfileService } from '../../../core/services/customer/profile.service';

@Component({
  standalone: true,
  selector: 'app-my-profile',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatIconModule
  ],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class MyProfileComponent implements OnInit {

  form!: FormGroup;
  isSaving = false;

  constructor(
    readonly fb: FormBuilder,
    readonly profileService: ProfileService,
    readonly snackBar: MatSnackBar,
    readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.loadProfile();
  }

  buildForm() {
    this.form = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: [{ value: '', disabled: true }],
      phoneNumber: [''],
      role: [{ value: '', disabled: true }],
      createdAt: [{ value: '', disabled: true }]
    });
  }

  loadProfile() {
    this.profileService.getMyProfile().subscribe(profile => {
      this.form.patchValue(profile);
      this.cdr.detectChanges();
    });
  }

  save() {
    if (this.form.invalid) return;

    this.isSaving = true;

    const payload = {
      fullName: this.form.value.fullName,
      phoneNumber: this.form.value.phoneNumber
    };

    this.profileService.updateMyProfile(payload)
      .pipe(
        finalize(() => {
          
          this.isSaving = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: () => {
          this.snackBar.open(
            'Profile updated successfully',
            'Close',
            { duration: 3000 }
          );
        },
        error: () => {
          this.snackBar.open(
            'Failed to update profile',
            'Close',
            { duration: 3000 }
          );
        }
      });
  }
  deleteAccount() {
    const confirmed = confirm(
      'This will deactivate your account and log you out. Are you sure?'
    );

    if (!confirmed) return;

    this.profileService.deleteMyAccount().subscribe({
      next: () => {
        this.snackBar.open(
          'Your account has been deactivated',
          'Close',
          { duration: 3000 }
        );

        // Clear session and redirect
        localStorage.clear();
        location.href = '/login';
      },
      error: () => {
        this.snackBar.open(
          'Failed to deactivate account',
          'Close',
          { duration: 3000 }
        );
      }
    });
  }

}
