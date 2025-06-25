import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { InputComponent } from '../../../components/input/input.component';
import { DepartmentService } from '../../../services/department.service';
import { SnackbarService } from '../../../services/snackbar.service';

@Component({
  selector: 'app-department-create',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    InputComponent,
  ],
  templateUrl: './department-create.component.html',
  styleUrl: './department-create.component.css',
  standalone: true
})
export class DepartmentCreateComponent implements OnInit{
  private snackbar = inject(SnackbarService);
  private _departmentService = inject(DepartmentService);

  departmentForm: FormGroup = new FormGroup({
    departmentName: new FormControl("", [Validators.required, Validators.minLength(2), Validators.maxLength(50)])
  });

  constructor() {}

  ngOnInit(): void {
    this.capitalizeDepartmentName();
  }

  /** Handles department change from input component and assigns departmentName value to departmentForm */
  handleDepartmentChange(departmentName: string): void {
    this.departmentForm.controls["departmentName"].setValue(departmentName);
  }

  onSubmit() {
    if (this.departmentForm.valid) {
      const departmentName = this.departmentForm.value.departmentName;
      if (!this._departmentService.checkDuplicates(departmentName)) {
        this._departmentService.createDepartment(this.departmentForm.value);
        this.departmentForm.reset();
        this._departmentService.notifyDepartmentsChanged();
        this.snackbar.success("Department created.");
      } else {
        this.snackbar.error("Department already exists!");
      }
    } else {
      this.snackbar.warning("Department failed to be created.");
    }
  }

  /** Capitalize departmentName input */
  capitalizeDepartmentName(): void {
    this.departmentForm.get('departmentName')?.valueChanges.subscribe(val => {
      if (val) {
        this.departmentForm.get('departmentName')?.setValue(
          val.toUpperCase(),
          { emitEvent: false }  // Prevents infinite loop
        );
      }
    });
  }
}
