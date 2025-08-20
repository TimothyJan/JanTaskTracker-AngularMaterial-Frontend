import { Component, inject, Inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { Department } from '../../../models/department.model';
import { InputComponent } from '../../input/input.component';
import { Subject } from 'rxjs';

import { SnackbarService } from '../../../services/snackbar.service';
import { DepartmentService } from '../../../services/department.service';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-department-edit',
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    InputComponent,
    MatProgressSpinnerModule
  ],
  templateUrl: './department-edit.component.html',
  styleUrl: './department-edit.component.css',
  standalone: true
})
export class DepartmentEditComponent implements OnInit, OnDestroy {
  private _snackbarService = inject(SnackbarService);
  private _departmentService = inject(DepartmentService);
  private unsubscribe$ = new Subject<void>();

  isLoading: boolean = false;
  departmentForm: FormGroup = new FormGroup({
    departmentId: new FormControl(-1, [Validators.required, Validators.pattern(/^\d+$/)]),
    departmentName: new FormControl("", [Validators.required, Validators.minLength(2), Validators.maxLength(50)])
  });

  constructor(
    private dialogRef: MatDialogRef<DepartmentEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { departmentId: number },
  ) { }

  ngOnInit() {
    this.setDepartmentFormValues();
  }

  /** Set departmentForm using getDepartmentById */
  setDepartmentFormValues(): void {
    this.isLoading = true;
    const dept = this._departmentService.getDepartmentById(this.data.departmentId);
    this.departmentForm.patchValue({
      departmentId: dept?.departmentId,
      departmentName: dept?.departmentName
    })
    this.isLoading = false;
  }

  /** Handle department name input changes */
  onDepartmentNameChange(newValue: string): void {
    this.departmentForm.controls["departmentName"].setValue(newValue.toUpperCase());
  }

  /** Save Changes */
  saveChanges(): void {
    if(this.departmentForm.valid) {
      this.isLoading = true;
      const newDepartment = new Department(
        this.departmentForm.controls["departmentId"].value,
        this.departmentForm.controls["departmentName"].value
      );
      this._departmentService.updateDepartment(newDepartment);
      this._departmentService.notifyDepartmentsChanged();
      this._snackbarService.success("Department saved.");
      this.isLoading = false;
    } else {
      this._snackbarService.error("Invalid department values");
    }
  }

  /** Cancel and close dialog */
  cancel(): void {
    this.dialogRef.close(null);
  }

  /** Confirm save */
  confirm(): void {
    this.saveChanges();
    this.dialogRef.close(this.data.departmentId);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
