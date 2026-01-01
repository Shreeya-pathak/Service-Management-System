import { Component } from '@angular/core';

@Component({
  selector: 'app-user-approval-pending',
  standalone: true,
  template: `
    <h2>Approval Pending</h2>
    <p>Your account is awaiting admin approval.</p>
    <p>You will get full access once approved.</p>
  `
})
export class UserApprovalPendingComponent {}

