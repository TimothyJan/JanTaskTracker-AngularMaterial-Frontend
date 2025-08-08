import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { SnackbarService } from '../../../services/snackbar.service';
import { EmployeeService } from '../../../services/employee.service';
import { Employee } from '../../../models/employee.model';

import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { EmployeeEditComponent } from '../../../components/dialogs/employee-edit/employee-edit.component';
import { Department } from '../../../models/department.model';
import { Role } from '../../../models/role.model';
import { DepartmentService } from '../../../services/department.service';
import { RoleService } from '../../../services/role.service';
import { TruncatePipe } from '../../../pipes/truncate.pipe';

@Component({
  selector: 'app-employee-list',
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    MatGridListModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatButtonToggleModule,
    TruncatePipe
  ],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css',
  standalone: true
})
export class EmployeeListComponent implements OnInit{
  private _snackbar = inject(SnackbarService);
  private _employeeService = inject(EmployeeService);
  private _departmentService = inject(DepartmentService);
  private _roleService = inject(RoleService);
  departments: Department[] = [];
  roles: Role[] = []
  employees: Employee[] = [];

  constructor(
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getEmployees();
    this.getRoles();
    this.getDepartments();
    this._employeeService.employeesChanged$.subscribe(() => {
      this.getRoles();
      this.getDepartments();
    })
  }

  /** Get all employees */
  getEmployees(): void {
    this.employees = this._employeeService.getEmployees();
  }

  /** Get all departments */
  getDepartments(): void {
    this.departments = this._departmentService.getDepartments();
  }

  /** Get all roles */
  getRoles(): void {
    this.roles = this._roleService.getRoles();
  }

  /** Get Department name from DepartmentId */
  getDepartmentName(departmentId: number): string | undefined {
    const department = this.departments.find(dep => dep.departmentId === departmentId);
    return department ? department.departmentName : undefined;
  }

  /** Get Role name from RoleId */
  getRoleName(roleId: number): string | undefined {
    const role = this.roles.find(role => role.roleId === roleId);
    return role ? role.roleName : undefined;
  }

  /** Open Role Edit dialog */
  onOpenEditDialog(employeeId: number): void {
    this.dialog.open(EmployeeEditComponent, {
      width: '400px',
      data: { employeeId }
    });
  }

  /** Delete Role */
  onDelete(employeeId: number): void {
    const confirmDelete = confirm('Are you sure you want to delete this role?');
    if (confirmDelete) {
      this._employeeService.deleteEmployee(employeeId);
      this.getEmployees();
      this._snackbar.success("Role deleted.");
    }
  }
}
