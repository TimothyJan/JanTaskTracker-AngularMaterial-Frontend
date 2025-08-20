import { Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from '../../../components/input/input.component';
import { SelectDepartmentComponent } from "../../../components/select-department/select-department.component";
import { Subject } from 'rxjs';

import { SnackbarService } from '../../../services/snackbar.service';
import { RoleService } from '../../../services/role.service';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-role-create',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatSelectModule,
    InputComponent,
    SelectDepartmentComponent,
    MatProgressSpinnerModule
],
  templateUrl: './role-create.component.html',
  styleUrl: './role-create.component.css',
  standalone: true
})
export class RoleCreateComponent implements OnDestroy {
  private _snackbar = inject(SnackbarService);
  private _roleService = inject(RoleService);
  private unsubscribe$ = new Subject<void>();

  isLoading: boolean = false;
  roleForm: FormGroup = new FormGroup({
    roleName: new FormControl("", [Validators.required, Validators.minLength(2), Validators.maxLength(50)]),
    departmentId: new FormControl(null, Validators.required)
  });

  constructor() { }

  /** Handle department select changes */
  handleDepartmentChange(departmentId: number): void {
    this.roleForm.controls["departmentId"].setValue(departmentId);
  }

  /** Handles role change from input component and assigns roleName value to roleForm */
  handleRoleChange(roleName: string): void {
    this.roleForm.controls["roleName"].setValue(roleName.toUpperCase());
  }

  onSubmit(): void {
    this.isLoading = true;
    if (this.roleForm.valid) {
      const formValue = this.roleForm.value;
      if(!this._roleService.checkDuplicates(formValue)) {
        this._roleService.addRole(formValue);
        this._roleService.notifyRolesChanged();
        this._snackbar.success("Role created.");
        this.isLoading = false;
      }
      else {
        this._snackbar.error("Role already exists.");
        this.isLoading = false;
      }
    }
    else {
      this._snackbar.error("Role failed to be created.");
      this.isLoading = false;
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
