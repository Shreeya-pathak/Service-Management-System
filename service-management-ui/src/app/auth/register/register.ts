import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

import { AuthService } from '../../core/services/auth/auth.service';
import { SnackbarService } from '../../shared/snackbar.service';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ]
})
export class RegisterComponent {

  form: FormGroup;
  isLoading = false;

  constructor(
    readonly fb: FormBuilder,
    readonly auth: AuthService,
    readonly router: Router,
    readonly snack: SnackbarService
  ) {
    this.form = this.fb.group(
      {
        fullName: ['', Validators.required],
        email: [
          '',
          [
            Validators.required,
            Validators.email,
            Validators.pattern(/^[a-zA-Z0-9._%+-]+@gmail\.com$/)
          ]
        ],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
        role: ['', Validators.required]
      },
      { validators: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(control: AbstractControl) {
    const password = control.get('password')?.value;
    const confirm = control.get('confirmPassword')?.value;
    return password === confirm ? null : { passwordMismatch: true };
  }

  register() {
    if (this.form.invalid || this.isLoading) {
      this.form.markAllAsTouched();
      this.snack.show('Please fill all fields correctly');
      return;
    }

    this.isLoading = true;

    const payload = {
      fullName: this.form.value.fullName,
      email: this.form.value.email,
      password: this.form.value.password,
      roleName: this.form.value.role
    };

    this.auth.register(payload).subscribe({
      next: () => {
        this.isLoading = false;
        this.snack.show('Registration successful. Please login.');
        this.router.navigate(['/login']);
      },
      error: err => {
        this.isLoading = false;
        this.snack.show(err?.error || 'Registration failed');
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
