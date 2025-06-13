import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { MatRippleModule } from '@angular/material/core';

@Component({
  selector: 'app-organizer',
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatDividerModule,
    MatRippleModule
  ],
  templateUrl: './organizer.component.html',
  styleUrl: './organizer.component.css',
  standalone: true
})
export class OrganizerComponent {
  public appPages = [
    { title: 'Home', url: '/home', icon: 'home' },
    { title: 'Projects', url: '/projects', icon: 'description' },
    { title: 'Employees', url: '/employees', icon: 'people' },
    { title: 'Roles', url: '/roles', icon: 'person' },
    { title: 'Departments', url: '/departments', icon: 'business' },
  ];
  currentYear = new Date().getFullYear();
  isMenuOpen = true;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
