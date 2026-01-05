import { ViewChild, AfterViewInit,ChangeDetectorRef,Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule,MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import {UserManagementService,ManagedUser} from '../../../core/services/admin/user-management.service';


@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatSnackBarModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatPaginatorModule

  ],
  templateUrl: './manage-users.html',
  styleUrls: ['./manage-users.css']
})


export class ManageUsersComponent implements OnInit,AfterViewInit {

  displayedColumns = [
    'fullName',
    'email',
    'phoneNumber',
    'roleName',
    'status',
    'action'
  ];

  dataSource = new MatTableDataSource<ManagedUser>();
   @ViewChild(MatPaginator) paginator!: MatPaginator;
  loading = false;

  constructor(
    readonly userService: UserManagementService,
    readonly snackBar: MatSnackBar,
    readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.dataSource.filterPredicate = (data, filter) => {
      const combined =
        `${data.fullName} ${data.email} ${data.roleName} ${data.phoneNumber ?? ''}`
          .toLowerCase();

      return combined.includes(filter);
    };

    this.loadUsers();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }



  loadUsers() {
    this.loading = true;
    this.userService.getAll().subscribe({
      next: (res) => {
        this.dataSource.data = [...res];
        if (this.paginator) {
          this.paginator.firstPage();
        }
        this.cdr.detectChanges();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('Failed to load users', 'Close', { duration: 3000 });
      }
    });
  }

  toggleStatus(user: ManagedUser) {
    this.userService.toggleStatus(user.userId).subscribe({
      next: () => {
        this.loadUsers();

        this.snackBar.open('User status updated', 'Close', {
          duration: 2500
        });
      },
      error: () => {
        this.snackBar.open('Action failed', 'Close', {
          duration: 3000
        });
      }
    });
  }

  trackByUserId(index: number, user: ManagedUser) {
    return user.userId;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }




}
