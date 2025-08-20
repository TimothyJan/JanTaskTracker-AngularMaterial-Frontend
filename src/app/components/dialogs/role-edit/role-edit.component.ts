import { Component, Inject, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { Role } from '../../../models/role.model';
import { InputComponent } from '../../input/input.component';
import { SelectDepartmentComponent } from "../../select-department/select-department.component";
import { Subject } from 'rxjs';

import { SnackbarService } from '../../../services/snackbar.service';
import { RoleService } from '../../../services/role.service';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-role-edit',
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    InputComponent,
    SelectDepartmentComponent,
    MatProgressSpinnerModule
],
  templateUrl: './role-edit.component.html',
  styleUrl: './role-edit.component.css',
  standalone: true
})
export class RoleEditComponent implements OnInit, OnDestroy {
  private _snackbarService = inject(SnackbarService);
  private _roleService = inject(RoleService);
  private unsubscribe$ = new Subject<void>();

  isLoading: boolean = false;
  roleForm: FormGroup = new FormGroup({
    roleId: new FormControl(-1, [Validators.required, Validators.pattern(/^\d+$/)]),
    roleName: new FormControl("", [Validators.required, Validators.minLength(2), Validators.maxLength(50)]),
    departmentId: new FormControl(-1, [Validators.required, Validators.pattern(/^\d+$/)])
  });

  constructor(
    private dialogRef: MatDialogRef<RoleEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { roleId: number },
  ) {}

  ngOnInit(): void {
    this.setRoleFormValues();
  }

  setRoleFormValues(): void {
    this.isLoading = true;
    const role = this._roleService.getRoleById(this.data.roleId);
    this.roleForm.patchValue({
      roleId: role?.roleId,
      roleName: role?.roleName,
      departmentId: role?.departmentId
    })
    this.isLoading = false;
  }

  /** Handle department select changes */
  handleDepartmentChange(departmentId: number): void {
    this.roleForm.controls["departmentId"].setValue(departmentId);
  }

  /** Handle department name input changes */
  handleRoleNameChange(newValue: string): void {
    this.roleForm.controls["roleName"].setValue(newValue.toUpperCase());
  }

  /** Save Changes */
  saveChanges(): void {
    if (this.roleForm.valid) {
      this.isLoading = true;
      const newRole = new Role(
        this.roleForm.controls["roleId"].value,
        this.roleForm.controls["roleName"].value,
        this.roleForm.controls["departmentId"].value,
      )
      this._roleService.updateRole(newRole);
      this._roleService.notifyRolesChanged();
      this._snackbarService.success("Role saved.");
      this.isLoading = false;
    } else {
      this._snackbarService.error("Invalid role values");
    }

  }

  /** Cancel and close dialog */
  cancel(): void {
    this.dialogRef.close(null);
  }

  /** Confirm save */
  confirm(): void {
    this.saveChanges();
    this.dialogRef.close(this.data.roleId);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
