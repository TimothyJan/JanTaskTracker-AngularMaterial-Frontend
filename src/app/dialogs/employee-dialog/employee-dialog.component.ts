import { Component, Inject, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { InputSalaryComponent } from '../../components/input-salary/input-salary.component';
import { InputComponent } from '../../components/input/input.component';
import { SelectDepartmentComponent } from '../../components/select-department/select-department.component';
import { SelectRoleComponent } from '../../components/select-role/select-role.component';

import { SnackbarService } from '../../services/snackbar.service';
import { EmployeeService } from '../../services/employee.service';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-employee-dialog',
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
  templateUrl: './employee-dialog.component.html',
  styleUrl: './employee-dialog.component.css',
  standalone: true
})
export class EmployeeDialogComponent  implements OnInit, OnDestroy {
  private _snackbarService = inject(SnackbarService);
  private _employeeService = inject(EmployeeService);
  private unsubscribe$ = new Subject<void>();

  isLoading: boolean = false;
  employeeForm: FormGroup = new FormGroup({
    employeeId: new FormControl(0, [Validators.pattern(/^\d+$/)]),
    name: new FormControl("", [Validators.required, Validators.minLength(2), Validators.maxLength(100)]),
    salary: new FormControl(0, [Validators.min(0), Validators.required, Validators.pattern(/^\d+$/)]),
    departmentId: new FormControl(-1, [Validators.required, Validators.pattern(/^\d+$/)]),
    roleId: new FormControl(-1, [Validators.required, Validators.pattern(/^\d+$/)])
  });

  constructor(
    private dialogRef: MatDialogRef<EmployeeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { employeeId: number },
  ) {}

  ngOnInit(): void {
    if(this.data.employeeId !== undefined) {
      this.setEmployeeFormValues();
    }
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

  /** Cancel and close dialog */
  cancel(): void {
    this.dialogRef.close(null);
  }

  /** Confirm save */
  confirm(): void {
    if(this.data.employeeId === undefined) {
      this.createEmployee();
    } else {
      this.updateEmployee();
    }
  }

  createEmployee(): void {
    if (this.employeeForm.valid) {
      this.isLoading = true;
      const newEmployee = this.employeeForm.value;
      this._employeeService.addEmployee(newEmployee);
      this._employeeService.notifyEmployeesChanged();
      this._snackbarService.success("Employee created.");
      this.dialogRef.close(this.data.employeeId);
      this.isLoading = false;
    }
    else {
      this._snackbarService.error("Employee failed to be created.");
    }
  }

  /** Save Changes */
  updateEmployee(): void {
    this.isLoading = true;
    const updatedEmployee = this.employeeForm.value;
    this._employeeService.updateEmployee(updatedEmployee);
    this._employeeService.notifyEmployeesChanged();
    this._snackbarService.success("Employee saved.");
    this.dialogRef.close(this.data.employeeId);
    this.isLoading = false;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
