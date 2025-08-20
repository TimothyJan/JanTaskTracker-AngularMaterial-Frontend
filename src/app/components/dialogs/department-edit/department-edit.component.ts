import { Component, inject, Inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  originalDepartment: Department = { departmentId: -1, departmentName: "" };
  editedDepartment: Department = { departmentId: -1, departmentName: "" };

  constructor(
    private dialogRef: MatDialogRef<DepartmentEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { departmentId: number },
  ) { }

  ngOnInit() {
    this.getDepartmentById();
  }

  /** Get Department */
  getDepartmentById(): void {
    const dept = this._departmentService.getDepartmentById(this.data.departmentId);
    if (!dept) {
      console.error("Department not found");
      this.dialogRef.close(null);
      return;
    }
    this.originalDepartment = { ...dept };
    this.editedDepartment = { ...dept };
  }

  /** Handle department name input changes */
  onDepartmentNameChange(newValue: string): void {
    this.editedDepartment.departmentName = newValue.toUpperCase();
  }

  /** Save Changes */
  saveChanges(): void {
    this.isLoading = true;
    this._departmentService.updateDepartment(this.editedDepartment);
    this._departmentService.notifyDepartmentsChanged();
    this._snackbarService.success("Department saved.");
    this.isLoading = false;
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
