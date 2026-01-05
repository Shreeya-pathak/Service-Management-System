import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-service-manager',
  imports: [CommonModule, RouterModule],
  templateUrl: './service-manager.html',
  styleUrls: ['./service-manager.css']
})
export class ServiceManagerComponent {}
