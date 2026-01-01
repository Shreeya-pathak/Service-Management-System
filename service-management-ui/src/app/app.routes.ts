

import { ApprovalPendingComponent } from './dashboards/admin/approval-pending/approval-pending';
import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth-guard';


import { ServiceCategoriesComponent } from './dashboards/admin/service-categories/service-categories';
import { AdminComponent } from './dashboards/admin/admin';
import { CustomerComponent } from './dashboards/customer/customer';
import { TechnicianComponent } from './dashboards/technician/technician';
import { ServiceManagerComponent } from './dashboards/service-manager/service-manager';
import { ServicesComponent } from './dashboards/admin/services/services';
import { RoleGuard } from './core/guards/role-guard';
import { UserApprovalPendingComponent } from './dashboards/user-approval-pending/user-approval-pending';


export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', loadComponent: () => import('./auth/login/login').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./auth/register/register').then(m => m.RegisterComponent) },

  // ✅ USER pending page (NOT admin)
  { path: 'user-approval-pending', component: UserApprovalPendingComponent },

  // ✅ ADMIN
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'Admin' },
    children: [
      { path: 'approvals', component: ApprovalPendingComponent }, // ADMIN approvals
      { path: 'service-categories', component: ServiceCategoriesComponent },
      { path: 'services', component: ServicesComponent }
    ]
  },

  // ✅ CUSTOMER
  {
    path: 'customer',
    component: CustomerComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'Customer' }
  },

  // ✅ TECHNICIAN
  {
    path: 'technician',
    component: TechnicianComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'Technician' }
  },

  // ✅ SERVICE MANAGER
  {
    path: 'service-manager',
    component: ServiceManagerComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'ServiceManager' }
  }
];
