import { Component, Inject, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SidenavService } from '../../services/sidenav.service';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs';
import { NavItem } from '../../models/nav-item.model';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatToolbarModule,
  ],
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements AfterViewInit, OnDestroy {
  @ViewChild('sidenav') matSidenav!: MatSidenav;
  isBrowser: boolean;
  private subscription: Subscription;
  currentYear = new Date().getFullYear();

  navItems: NavItem[] = [
    new NavItem("/home", "home", "Home"),
    new NavItem("/projects", "settings", "Projects"),
    new NavItem("/employees", "settings", "Employees"),
    new NavItem("/roles", "settings", "Roles"),
    new NavItem("/departments", "dashboard", "Departments"),
  ];

  constructor(
    public sidenavService: SidenavService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.subscription = this.sidenavService.isOpen$.subscribe(open => {
      if (this.matSidenav) {
        open ? this.matSidenav.open() : this.matSidenav.close();
      }
    });
  }

  ngAfterViewInit() {
    // Use the new currentState getter instead of .value
    if (this.sidenavService.currentState) {
      setTimeout(() => this.matSidenav.open());
    } else {
      setTimeout(() => this.matSidenav.close());
    }
  }

  toggleSidenav() {
    this.sidenavService.toggle();
  }

  closeSidenav() {
    this.sidenavService.close();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
