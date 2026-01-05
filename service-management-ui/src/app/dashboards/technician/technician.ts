import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-technician',
  imports: [CommonModule, RouterModule],
  templateUrl: './technician.html',
  styleUrls: ['./technician.css']
})
export class TechnicianComponent {}
