import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-approval-pending',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="pending-wrapper">
      <div class="pending-card">

        <span class="material-icons pending-icon">
          hourglass_top
        </span>

        <h2>Approval Pending</h2>

        <p class="main-text">
          Your account is currently under review by the administrator.
        </p>

        <p class="sub-text">
          Once approved, you will automatically gain full access to the system.
        </p>

        <div class="note">
          ⏳ This usually takes a short while. Please check back later.
        </div>

      </div>
    </div>
  `,
  styles: [`
    .pending-wrapper {
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;

      background: linear-gradient(
        135deg,
        #f6f0fb,
        #ffffff
      );
    }

    .pending-card {
      width: 420px;
      padding: 32px;
      text-align: center;

      background: #ffffff;
      border-radius: 16px;
      box-shadow: 0 10px 30px rgba(123, 31, 162, 0.15);
    }

    .pending-icon {
      font-size: 48px;
      color: #7b1fa2;
      margin-bottom: 12px;
    }

    h2 {
      margin: 8px 0;
      color: #6a1b9a;
      font-weight: 600;
    }

    .main-text {
      font-size: 15px;
      color: #444;
      margin: 12px 0 6px;
    }

    .sub-text {
      font-size: 14px;
      color: #666;
      margin-bottom: 16px;
    }

    .note {
      margin-top: 16px;
      padding: 10px;
      font-size: 13px;

      background: #f3e5f5;
      color: #6a1b9a;
      border-radius: 8px;
    }
  `]
})
export class UserApprovalPendingComponent {}
