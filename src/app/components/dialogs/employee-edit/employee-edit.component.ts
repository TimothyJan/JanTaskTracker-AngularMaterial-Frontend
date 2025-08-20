import { Component, Inject, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
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
  employeeForm: FormGroup = new FormGroup({
    employeeId: new FormControl(-1, [Validators.required, Validators.pattern(/^\d+$/)]),
    name: new FormControl("", [Validators.required, Validators.minLength(2), Validators.maxLength(100)]),
    salary: new FormControl(0, [Validators.min(0), Validators.required]),
    departmentId: new FormControl(-1, [Validators.required, Validators.pattern(/^\d+$/)]),
    roleId: new FormControl(-1, [Validators.required, Validators.pattern(/^\d+$/)])
  });

  constructor(
    private dialogRef: MatDialogRef<EmployeeEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { employeeId: number },
  ) {}

  ngOnInit(): void {
    this.setEmployeeFormValues();
  }

  setEmployeeFormValues(): void {
    this.isLoading = true;
    const employee = this._employeeService.getEmployeeById(this.data.employeeId);
    this.employeeForm.patchValue({
      employeeId: employee?.employeeId,
      name: employee?.name,
      salary: employee?.salary,
      departmentId: employee?.departmentId,
      roleId: employee?.roleId
    })
    this.isLoading = false;
  }

  /** Handle department select changes */
  handleDepartmentChange(departmentId: number): void {
    this.employeeForm.controls["departmentId"].setValue(departmentId);
  }

  /** Handle role select changes */
  handleRoleChange(roleId: number): void {
    this.employeeForm.controls["roleId"].setValue(roleId);
  }

  /** Handle department name input changes */
  handleEmployeeNameChange(newValue: string): void {
    this.employeeForm.controls["name"].setValue(newValue.toUpperCase());
  }

  /** Handle salary input changes */
  handleSalaryChange(newSalary: number): void {
    this.employeeForm.controls["salary"].setValue(newSalary);
  }

  /** Save Changes */
  saveChanges(): void {
    this.isLoading = true;
    const updatedEmployee = new Employee(
      this.employeeForm.controls["employeeId"].value,
      this.employeeForm.controls["name"].value,
      this.employeeForm.controls["salary"].value,
      this.employeeForm.controls["departmentId"].value,
      this.employeeForm.controls["roleId"].value,
    )
    this._employeeService.updateEmployee(updatedEmployee);
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
