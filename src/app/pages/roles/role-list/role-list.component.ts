import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { SnackbarService } from '../../../services/snackbar.service';
import { RoleService } from '../../../services/role.service';
import { Role } from '../../../models/role.model';
import { DepartmentService } from '../../../services/department.service';
import { Department } from '../../../models/department.model';

import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { RoleEditComponent } from '../../../components/dialogs/role-edit/role-edit.component';

@Component({
  selector: 'app-role-list',
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    MatGridListModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatButtonToggleModule
  ],
  templateUrl: './role-list.component.html',
  styleUrl: './role-list.component.css',
  standalone: true
})
export class RoleListComponent implements OnInit {
  private _snackbar = inject(SnackbarService);
  private _departmentService = inject(DepartmentService);
  private _roleService = inject(RoleService);
  roles: Role[] = [];
  departments: Department[] = [];
  sortedRoles: Role[] = [];
  sortBy: 'role' | 'department' | 'none' = 'none';

  constructor(
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getRoles();
    this.getDepartments();
    this._roleService.rolesChanged$.subscribe(() => {
      this.getRoles();
      this.sortRoles();
    });
  }

  /** Get all roles */
  getRoles(): void {
    this.roles = this._roleService.getRoles();
    this.sortRoles();
  }

  /** Get all departments */
  getDepartments(): void {
    this.departments = this._departmentService.getDepartments();
  }

  /** Sort roles based on current sortBy value */
  sortRoles(): void {
    if (this.sortBy === 'none') {
      this.sortedRoles = [...this.roles];
      return;
    }

    this.sortedRoles = [...this.roles].sort((a, b) => {
      if (this.sortBy === 'role') {
        return a.roleName.localeCompare(b.roleName);
      } else {
        const aDept = this.getDepartmentName(a.departmentId) || '';
        const bDept = this.getDepartmentName(b.departmentId) || '';
        return aDept.localeCompare(bDept);
      }
    });
  }

  /** Toggle sorting */
  toggleSort(sortType: 'role' | 'department'): void {
    if (this.sortBy === sortType) {
      this.sortBy = 'none'; // Toggle off if already sorted by this type
    } else {
      this.sortBy = sortType; // Set new sort type
    }
    this.sortRoles();
  }

  /** Get Department name from DepartmentId */
  getDepartmentName(departmentId: number): string | undefined {
    const department = this.departments.find(dep => dep.departmentId === departmentId);
    return department ? department.departmentName : undefined;
  }

  /** Open Role Edit dialog */
  onOpenEditDialog(roleId: number): void {
    this.dialog.open(RoleEditComponent, {
      width: '400px',
      data: { roleId }
    });
  }

  /** Delete Role */
  onDelete(roleId: number): void {
    const confirmDelete = confirm('Are you sure you want to delete this role?');
    if (confirmDelete) {
      this._roleService.deleteRole(roleId);
      this._snackbar.success("Role deleted.");
    }
  }
}
