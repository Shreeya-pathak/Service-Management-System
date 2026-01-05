import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './customer.html',
  styleUrls: ['./customer.css']
})
export class CustomerComponent {}
