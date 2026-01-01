import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TokenService } from '../../core/services/token.service';

@Component({
  selector: 'app-technician-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>Technician Portal</h2>

    <div *ngIf="isPending" class="pending-box">
      Your account approval is pending.
    </div>

    <div *ngIf="!isPending">
      Full technician access.
    </div>
  `
})
export class TechnicianComponent {

  isPending = false;

  constructor(readonly tokenService: TokenService) {
    this.isPending = this.tokenService.approvalStatus === 'Pending';
  }
}
