import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { TokenService } from '../../core/services/token.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent {

  constructor(
    public tokenService: TokenService,
    readonly router: Router
  ) {}

  get role() {
    return this.tokenService.role;
  }

  get isLoggedIn() {
    return !!this.tokenService.token;
  }

  get userName() {
    return this.tokenService.fullName;
  }

  logout() {
    this.tokenService.clear();
    this.router.navigate(['/login']);
  }
}
