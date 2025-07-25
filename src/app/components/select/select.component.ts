import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { Department } from '../../models/department.model';
import { Role } from '../../models/role.model';
import { Employee } from '../../models/employee.model';
import { DepartmentService } from '../../services/department.service';
import { RoleService } from '../../services/role.service';
import { EmployeeService } from '../../services/employee.service';
import { FormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-select',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './select.component.html',
  styleUrl: './select.component.css',
  standalone: true
})
export class SelectComponent implements OnInit {
  @Input() data = "";
  @Input() value = 0;
  departments: Department[] = [];
  roles: Role[] = [];
  employees: Employee[] = [];

  @Output() departmentChanged = new EventEmitter<number>();

  private _departmentService = inject(DepartmentService);
  private _roleService = inject(RoleService);
  private _employeeService = inject(EmployeeService);

  constructor() {}

  ngOnInit(): void {
    switch(this.data) {
      case "DEPARTMENTS":
        this.getDepartments();
        break;
      case "ROLES":
        this.getRoles();
        break;
      case "EMPLOYEES":
        this.getEmployees();
        break;
      default:
        console.log("Error with Select component.");
        break;
    }
  }

  /** Get all deparments */
  getDepartments(): void {
    this.departments = this._departmentService.getDepartments();
  }

  /** On department change, emit value */
  onDepartmentChange(event: MatSelectChange) {
    this.departmentChanged.emit(Number(event.value));
  }

  /** Get all roles */
  getRoles(): void {
    this.roles = this._roleService.getRoles();
  }

  /** Get all employees */
  getEmployees(): void {
    this.employees = this._employeeService.getEmployees();
  }
}
