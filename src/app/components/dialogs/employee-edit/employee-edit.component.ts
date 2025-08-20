import { Component, Inject, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputComponent } from '../../input/input.component';
import { SelectDepartmentComponent } from "../../select-department/select-department.component";
import { Employee } from '../../../models/employee.model';
import { SelectRoleComponent } from '../../select-role/select-role.component';
import { InputSalaryComponent } from "../../input-salary/input-salary.component";
import { Subject } from 'rxjs';

import { SnackbarService } from '../../../services/snackbar.service';
import { EmployeeService } from '../../../services/employee.service';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-employee-edit',
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    SelectDepartmentComponent,
    SelectRoleComponent,
    InputComponent,
    InputSalaryComponent,
    MatProgressSpinnerModule,
],
  templateUrl: './employee-edit.component.html',
  styleUrl: './employee-edit.component.css',
  standalone: true
})
export class EmployeeEditComponent implements OnInit, OnDestroy {
  private _snackbarService = inject(SnackbarService);
  private _employeeService = inject(EmployeeService);
  private unsubscribe$ = new Subject<void>();

  isLoading: boolean = false;
  originalEmployee: Employee = { employeeId: -1, name: "", salary: -1, departmentId: -1, roleId: -1};
  editedEmployee: Employee = { employeeId: -1, name: "", salary: -1, departmentId: -1, roleId: -1};

  constructor(
    private dialogRef: MatDialogRef<EmployeeEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { employeeId: number },
  ) {}

  ngOnInit(): void {
    this.getEmployeeById();
  }

  /** Get Employee */
  getEmployeeById(): void {
    this.isLoading = true;
    const employee = this._employeeService.getEmployeeById(this.data.employeeId);
    if (!employee) {
      console.error("Employee not found");
      this.dialogRef.close(null);
      return;
    }
    this.originalEmployee = { ...employee };
    this.editedEmployee =  { ...employee };
    this.isLoading = false;
  }

  /** Handle department select changes */
  handleDepartmentChange(departmentId: number): void {
    this.editedEmployee.departmentId = departmentId;
  }

  /** Handle role select changes */
  handleRoleChange(roleId: number): void {
    this.editedEmployee.roleId = roleId;
  }

  /** Handle department name input changes */
  handleEmployeeNameChange(newValue: string): void {
    this.editedEmployee.name = newValue.toUpperCase();
  }

  /** Handle salary input changes */
  handleSalaryChange(newSalary: number): void {
    this.editedEmployee.salary = newSalary;
  }

    /** Save Changes */
  saveChanges(): void {
    this.isLoading = true;
    this._employeeService.updateEmployee(this.editedEmployee);
    this._employeeService.notifyEmployeesChanged();
    this._snackbarService.success("Role saved.");
    this.isLoading = false;
  }

  /** Cancel and close dialog */
  cancel(): void {
    this.dialogRef.close(null);
  }

  /** Confirm save */
  confirm(): void {
    this.saveChanges();
    this.dialogRef.close(this.data.employeeId);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
