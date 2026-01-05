import { Component } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

import { NavbarComponent } from './shared/navbar/navbar';
import { fadeAnimation } from './shared/animations';
import { AuthService } from './core/services/auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    CommonModule
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  animations: [fadeAnimation]
})
export class App {

  showNavbar = false;

  constructor(
    public authService: AuthService,
    readonly router: Router
  ) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {

        const isAuthPage =
          event.urlAfterRedirects.startsWith('/login') ||
          event.urlAfterRedirects.startsWith('/register');

        this.showNavbar = this.authService.isLoggedIn() && !isAuthPage;
      });
  }
}
