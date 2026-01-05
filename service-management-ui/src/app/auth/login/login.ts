import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { AuthService } from '../../core/services/auth/auth.service';
import { TokenService } from '../../core/services/auth/token.service';
import { SnackbarService } from '../../shared/snackbar.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterModule
  ]
})
export class LoginComponent {

  form: FormGroup;
  isLoading = false;

  constructor(
    readonly fb: FormBuilder,
    readonly auth: AuthService,
    readonly token: TokenService,
    readonly router: Router,
    readonly snack: SnackbarService
  ) {
    this.form = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.email
          //Validators.pattern(/^[a-zA-Z0-9._%+-]+@\.com$/)
        ]
      ],
      password: ['', Validators.required]
    });

  }

  login() {
    if (this.form.invalid || this.isLoading) return;

    this.isLoading = true;

    this.auth.login(this.form.value).subscribe({
      next: res => {
        this.isLoading = false;

        this.token.set(
          res.token,
          res.role,
          res.approvalStatus,
          res.fullName
        );

        
        if (res.role === 'Admin') {
          this.router.navigate(['/admin']);
          return;
        }

        
        if (res.approvalStatus === 'Pending') {
          this.router.navigate(['/user-approval-pending']);
          return;
        }

        
        switch (res.role) {
          case 'Customer':
            this.router.navigate(['/customer']);
            break;
          case 'Technician':
            this.router.navigate(['/technician']);
            break;
          case 'ServiceManager':
            this.router.navigate(['/service-manager']);
            break;
        }
      },
      error: err => {
        this.isLoading = false;

        const message =
          err?.error?.message ||
          err?.error ||
          'Invalid email or password';

        this.snack.show(message);
      }
    });
  }

  
  goToRegister() {
    this.router.navigate(['/register']);
  }
}
