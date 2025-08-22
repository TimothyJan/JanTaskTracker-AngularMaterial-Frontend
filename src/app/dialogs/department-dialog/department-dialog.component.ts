import { Component, inject, Inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';

import { SnackbarService } from '../../services/snackbar.service';
import { DepartmentService } from '../../services/department.service';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-department-dialog',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
],
  templateUrl: './department-dialog.component.html',
  styleUrl: './department-dialog.component.css',
  standalone: true
})
export class DepartmentDialogComponent implements OnInit, OnDestroy {
  private _snackbarService = inject(SnackbarService);
  private _departmentService = inject(DepartmentService);
  private unsubscribe$ = new Subject<void>();

  isLoading: boolean = false;
  form: FormGroup = new FormGroup({
    departmentId: new FormControl(0, [Validators.pattern(/^\d+$/)]),
    departmentName: new FormControl("", [Validators.required, Validators.minLength(2), Validators.maxLength(50)])
  });

  constructor(
    private dialogRef: MatDialogRef<DepartmentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { departmentId?: number },
  ) { }

  ngOnInit() {
    if(this.data.departmentId !== undefined) {
      this.setDepartmentFormValues();
    }
  }

  /** Set form using getDepartmentById */
  setDepartmentFormValues(): void {
    this.isLoading = true;
    const dept = this._departmentService.getDepartmentById(this.data.departmentId!);
    this.form.patchValue({
      departmentId: dept?.departmentId,
      departmentName: dept?.departmentName
    })
    this.isLoading = false;
  }

  get errorControls() {
    const control = this.form.get('departmentName');
    if (control?.errors && control.touched) { // Add touched check
      if (control.errors['required']) return 'Department name is required';
      if (control.errors['minlength']) return 'Department name must be at least 2 characters'; // Fixed message
      if (control.errors['maxlength']) return 'Department name must be ≤ 50 characters';
    }
    return null;
  }

  /** Cancel and close dialog */
  cancel(): void {
    this.dialogRef.close(null);
  }

  /** Confirm create or update and close dialog*/
  confirm(): void {
    this.form.markAllAsTouched();
    if(this.data.departmentId === undefined) {
      this.createDepartment();
    } else {
      this.updateDepartment();
    }
  }

  createDepartment() {
    if (this.form.valid) {
      this.isLoading = true;
      const formValue = this.form.value;
      if (!this._departmentService.checkDuplicates(formValue.departmentName)) {
        this._departmentService.createDepartment(formValue);
        this._departmentService.notifyDepartmentsChanged();
        this._snackbarService.success("Department created.");
        this.dialogRef.close(this.data.departmentId);
        this.isLoading = false;
      } else {
        this._snackbarService.error("Department already exists.");
        this.isLoading = false;
      }
    } else {
      this._snackbarService.warning("Department failed to be created.");
    }
  }

  updateDepartment(): void {
    if(this.form.valid) {
      this.isLoading = true;
      const formValue = this.form.value
      if (!this._departmentService.checkDuplicates(formValue.departmentName)) {
        this._departmentService.updateDepartment(formValue);
        this._departmentService.notifyDepartmentsChanged();
        this._snackbarService.success("Department saved.");
        this.dialogRef.close(this.data.departmentId);
        this.isLoading = false;
      } else {
        this._snackbarService.error("Department already exists.");
        this.isLoading = false;
      }
    } else {
      this._snackbarService.error("Invalid department values");
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
