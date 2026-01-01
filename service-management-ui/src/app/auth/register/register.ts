import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router,  RouterModule } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';


import { AuthService } from '../../core/services/auth.service';
import { SnackbarService } from '../../shared/snackbar.service';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    RouterModule
    
  ]
})
export class RegisterComponent {

  form: FormGroup;

  constructor(
    readonly fb: FormBuilder,
    readonly auth: AuthService,
    readonly router: Router,
    readonly snack: SnackbarService
  ) {
    // ✅ Form initialized AFTER FormBuilder injection
    this.form = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      roleName: ['', Validators.required]
    });
  }

  register() {
    console.log('REGISTER CLICKED');

    if (this.form.invalid) return;

    this.auth.register(this.form.value).subscribe({
      next: (message: string) => {   // 🔥 CAPTURE BACKEND MESSAGE
        console.log('REGISTER SUCCESS');

        this.snack.show(message);    // ✅ shows correct text

        // clear auth state just in case
        localStorage.clear();

        this.router.navigateByUrl('/login'); // ✅ redirect works
      },
      error: (err) => {
        console.error('REGISTER ERROR:', err);

        this.snack.show(
          err.error || err.message || 'Registration failed'
        );
      }
    });
  }

}
