


import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth-guard';


import { AdminDashboardComponent } from './dashboards/admin/admin-dashboard/admin-dashboard';
import { ApprovalPendingComponent } from './dashboards/admin/approval-pending/approval-pending';
import { ServiceCategoriesComponent } from './dashboards/admin/service-categories/service-categories';
import { AdminComponent } from './dashboards/admin/admin';
import { CustomerComponent } from './dashboards/customer/customer';
import { TechnicianComponent } from './dashboards/technician/technician';
import { ServiceManagerComponent } from './dashboards/service-manager/service-manager';
import { ServicesComponent } from './dashboards/admin/services/services';
import { ManageUsersComponent } from './dashboards/admin/manage-users/manage-users';
import { RoleGuard } from './core/guards/role-guard';
import { UserApprovalPendingComponent } from './dashboards/user-approval-pending/user-approval-pending';


export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', loadComponent: () => import('./auth/login/login').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./auth/register/register').then(m => m.RegisterComponent) },

  
  { path: 'user-approval-pending', component: UserApprovalPendingComponent },

  
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'Admin' },
    children: [

      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'user-approvals', component: ApprovalPendingComponent },
      {
        path: 'payment-approvals',
        loadComponent: () =>
          import('./dashboards/admin/payment-approvals/payment-approvals')
            .then(m => m.PaymentApprovalsComponent)
      },

      {
        path: 'reports',
        loadComponent: () =>
          import('./dashboards/admin/admin-reports/admin-reports')
            .then(m => m.AdminReportsComponent)
      },
      {
        path: 'service-history',
        loadComponent: () =>
          import('./dashboards/admin/admin-service-history/admin-service-history')
            .then(m => m.AdminServiceHistoryComponent)
      },
      {
        path: 'payment-history',
        loadComponent: () =>
          import('./dashboards/admin/payment-history/payment-history')
            .then(m => m.AdminPaymentHistoryComponent)
      },
      { path: 'service-categories', component: ServiceCategoriesComponent },
      { path: 'services', component: ServicesComponent },
      { path: 'manage-users', component: ManageUsersComponent }

    ]

  },


  
  {
    path: 'customer',
    component: CustomerComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'Customer' },
    children: [

      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

      {
        path: 'dashboard',
        loadComponent: () =>
          import('./dashboards/customer/customer-dashboard/customer-dashboard')
            .then(m => m.CustomerDashboardComponent)
      },
      {
        path: 'raise-request',
        loadComponent: () =>
          import('./dashboards/customer/raise-request/raise-request')
            .then(m => m.RaiseRequestComponent)
      },
      {
        path: 'my-requests',
        loadComponent: () =>
          import('./dashboards/customer/my-requests/my-requests')
            .then(m => m.MyRequestsComponent)
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./dashboards/customer/profile/profile')
            .then(m => m.MyProfileComponent)
      },
      {
        path: 'service-history',
        loadComponent: () =>
          import('./dashboards/customer/customer-service-history/customer-service-history')
            .then(m => m.CustomerServiceHistoryComponent)
      },
      {
        path: 'catalog',
        loadComponent: () =>
          import('./dashboards/customer/service-catalog/service-catalog')
            .then(m => m.ServiceCatalogComponent)
      }




    ]
  },


  // ✅ TECHNICIAN
  {
  path: 'technician',
    component: TechnicianComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'Technician' },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./dashboards/technician/technician-dashboard/technician-dashboard')
            .then(m => m.TechnicianDashboardComponent)
      },
      {
        path: 'requests',
        loadComponent: () =>
          import('./dashboards/technician/technician-requests/technician-requests')
            .then(m => m.TechnicianRequestsComponent)
      }
    ]
  },

  // ✅ SERVICE MANAGER
  {
    path: 'service-manager',
    component: ServiceManagerComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'ServiceManager' },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./dashboards/service-manager/service-manager-dashboard/service-manager-dashboard').then(m => m.ServiceManagerDashboardComponent) },
      { path: 'assignments', loadComponent: () => import('./dashboards/service-manager/service-manager-assignments/service-manager-assignments').then(m => m.ServiceManagerAssignmentsComponent) },
      { path: 'monitor', loadComponent: () => import('./dashboards/service-manager/service-manager-monitor/service-manager-monitor').then(m => m.ServiceManagerMonitorComponent) },
      {
        path: 'reports',
        loadComponent: () =>
          import('./dashboards/service-manager/manager-reports/manager-reports')
            .then(m => m.ManagerReportsComponent)
      }
    ]
  }


];
