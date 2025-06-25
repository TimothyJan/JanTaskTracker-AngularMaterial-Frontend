import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Department } from '../../../models/department.model';
import { DepartmentService } from '../../../services/department.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { InputComponent } from '../../input/input.component';

@Component({
  selector: 'app-department-edit',
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    InputComponent
  ],
  templateUrl: './department-edit.component.html',
  styleUrl: './department-edit.component.css'
})
export class DepartmentEditComponent implements OnInit {
  originalDepartment: Department = { departmentId: -1, departmentName: "" };
  editedDepartment: Department = { departmentId: -1, departmentName: "" };

  constructor(
    private dialogRef: MatDialogRef<DepartmentEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { departmentId: number },
    private _departmentService: DepartmentService,
    private _snackbarService: SnackbarService
  ) { }

  ngOnInit() {
    this.getDepartment();
  }

  /** Get Department */
  getDepartment(): void {
    const dept = this._departmentService.getDepartment(this.data.departmentId);
    if (!dept) {
      console.error('Department not found');
      this.dialogRef.close(null);
      return;
    }
    this.originalDepartment = { ...dept };
    this.editedDepartment = { ...dept };
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

  /** Save Changes */
  saveChanges(): void {
    this._departmentService.updateDepartment(this.editedDepartment);
    this._departmentService.notifyDepartmentsChanged();
    this._snackbarService.success("Department saved.");
  }

  /** Handle department name input changes */
  onDepartmentNameChange(newValue: string): void {
    this.editedDepartment.departmentName = newValue.toUpperCase();
  }
}
