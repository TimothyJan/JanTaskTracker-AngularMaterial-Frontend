import { Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from '../../../components/input/input.component';
import { SelectDepartmentComponent } from '../../../components/select-department/select-department.component';
import { SelectRoleComponent } from "../../../components/select-role/select-role.component";
import { InputSalaryComponent } from "../../../components/input-salary/input-salary.component";
import { Subject } from 'rxjs';

import { SnackbarService } from '../../../services/snackbar.service';
import { EmployeeService } from '../../../services/employee.service';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-employee-create',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatSelectModule,
    InputComponent,
    SelectDepartmentComponent,
    SelectRoleComponent,
    InputSalaryComponent,
    MatProgressSpinnerModule
],
  templateUrl: './employee-create.component.html',
  styleUrl: './employee-create.component.css',
  standalone: true
})
export class EmployeeCreateComponent implements OnDestroy {
  private _snackbar = inject(SnackbarService);
  private _employeeService = inject(EmployeeService);
  private unsubscribe$ = new Subject<void>();

  isLoading: boolean = false;
  employeeForm: FormGroup = new FormGroup({
    name: new FormControl("", [Validators.required, Validators.minLength(2), Validators.maxLength(100)]),
    salary: new FormControl(0, [Validators.min(0), Validators.required]),
    departmentId: new FormControl(-1, Validators.required),
    roleId: new FormControl(-1, Validators.required)
  });

  constructor() {}

  /** Handle department select changes */
  handleDepartmentChange(departmentId: number): void {
    this.employeeForm.controls["departmentId"].setValue(departmentId);
  }

  /** Handles role select changes */
  handleRoleChange(roleId: number): void {
    this.employeeForm.controls["roleId"].setValue(roleId);
  }

  /** Handles employee name change from input component and assigns name value to employeeForm */
  handleEmployeeChange(employeeName: string): void {
    this.employeeForm.controls["name"].setValue(employeeName.toUpperCase());
  }

  /** Handles salary change from input component and assigns salary value to employeeForm */
  handleSalaryChange(salary: number): void {
    // Convert to number with 2 decimal places
    this.employeeForm.controls["salary"].setValue(Number(salary.toFixed(2)));
  }

  onSubmit(): void {
    this.isLoading = true;
    if (this.employeeForm.valid) {
      const formValue = this.employeeForm.value;
      this._employeeService.addEmployee(formValue);
      this._employeeService.notifyEmployeesChanged();
      this._snackbar.success("Employee created.");
      this.isLoading = false;
    }
    else {
      this._snackbar.error("Employee failed to be created.");
      this.isLoading = false;
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
