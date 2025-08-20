import { Component, Inject, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { InputComponent } from '../../input/input.component';
import { SelectDepartmentComponent } from "../../select-department/select-department.component";
import { Subject } from 'rxjs';

import { SnackbarService } from '../../../services/snackbar.service';
import { RoleService } from '../../../services/role.service';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-role-dialog',
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    InputComponent,
    SelectDepartmentComponent,
    MatProgressSpinnerModule
  ],
  templateUrl: './role-dialog.component.html',
  styleUrl: './role-dialog.component.css',
  standalone: true
})
export class RoleDialogComponent implements OnInit, OnDestroy {
  private _snackbarService = inject(SnackbarService);
  private _roleService = inject(RoleService);
  private unsubscribe$ = new Subject<void>();

  isLoading: boolean = false;
  roleForm: FormGroup = new FormGroup({
    roleId: new FormControl(0, [Validators.pattern(/^\d+$/)]),
    roleName: new FormControl("", [Validators.required, Validators.minLength(2), Validators.maxLength(50)]),
    departmentId: new FormControl(-1, [Validators.required, Validators.pattern(/^\d+$/)])
  });

  constructor(
    private dialogRef: MatDialogRef<RoleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { roleId?: number },
  ) {}

  ngOnInit(): void {
    if(this.data.roleId !== undefined) {
      this.setRoleFormValues();
    }
  }

  setRoleFormValues(): void {
    this.isLoading = true;
    const role = this._roleService.getRoleById(this.data.roleId!);
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

  /** Cancel and close dialog */
  cancel(): void {
    this.dialogRef.close(null);
  }

  /** Confirm save */
  confirm(): void {
    if(this.data.roleId === undefined) {
      this.createRole();
    } else {
      this.updateRole();
    }
  }

  createRole(): void {
    if (this.roleForm.valid) {
      this.isLoading = true;
      const newRole = this.roleForm.value;
      if(!this._roleService.checkDuplicates(newRole)) {
        this._roleService.createRole(newRole);
        this._roleService.notifyRolesChanged();
        this._snackbarService.success("Role created.");
        this.dialogRef.close(this.data.roleId);
        this.isLoading = false;
      }
      else {
        this._snackbarService.error("Role already exists.");
        this.isLoading = false;
      }
    }
    else {
      this._snackbarService.error("Role failed to be created.");
      this.isLoading = false;
    }
  }

  /** Save Changes */
  updateRole(): void {
    if (this.roleForm.valid) {
      this.isLoading = true;
      const updatedRole = this.roleForm.value;
      if(!this._roleService.checkDuplicates(updatedRole)) {
        this._roleService.updateRole(updatedRole);
        this._roleService.notifyRolesChanged();
        this._snackbarService.success("Role saved.");
        this.dialogRef.close(this.data.roleId);
        this.isLoading = false;
      }
      else {
        this._snackbarService.error("Role already exists.");
        this.isLoading = false;
      }
    } else {
      this._snackbarService.error("Invalid role values");
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
