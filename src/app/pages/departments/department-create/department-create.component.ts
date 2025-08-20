import { Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { InputComponent } from '../../../components/input/input.component';
import { Subject } from 'rxjs';

import { SnackbarService } from '../../../services/snackbar.service';
import { DepartmentService } from '../../../services/department.service';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-department-create',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    InputComponent,
    MatProgressSpinnerModule
  ],
  templateUrl: './department-create.component.html',
  styleUrl: './department-create.component.css',
  standalone: true
})
export class DepartmentCreateComponent implements OnDestroy {
  private _snackbar = inject(SnackbarService);
  private _departmentService = inject(DepartmentService);
  private unsubscribe$ = new Subject<void>();

  isLoading: boolean = false;
  departmentForm: FormGroup = new FormGroup({
    departmentName: new FormControl("", [Validators.required, Validators.minLength(2), Validators.maxLength(50)])
  });

  constructor() {}

  /** Handles department change from input component and assigns departmentName value to departmentForm */
  handleDepartmentChange(departmentName: string): void {
    this.departmentForm.controls["departmentName"].setValue(departmentName.toUpperCase());
  }

  onSubmit() {
    this.isLoading = true;
    if (this.departmentForm.valid) {
      const departmentName = this.departmentForm.value.departmentName;
      if (!this._departmentService.checkDuplicates(departmentName)) {
        this._departmentService.createDepartment(this.departmentForm.value);
        this._departmentService.notifyDepartmentsChanged();
        this._snackbar.success("Department created.");
        this.isLoading = false;
      } else {
        this._snackbar.error("Department already exists!");
        this.isLoading = false;
      }
    } else {
      this._snackbar.warning("Department failed to be created.");
      this.isLoading = false;
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
