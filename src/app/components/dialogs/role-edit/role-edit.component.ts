import { Component, Inject, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  originalRole: Role = { roleId: -1, roleName: "", departmentId: -1};
  editedRole: Role = { roleId: -1, roleName: "", departmentId: -1};

  constructor(
    private dialogRef: MatDialogRef<RoleEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { roleId: number },
  ) {}

  ngOnInit(): void {
    this.getRoleById();
  }

  /** Get Role */
  getRoleById(): void {
    this.isLoading = true;
    const role = this._roleService.getRoleById(this.data.roleId);
    this.isLoading = false;
    if (!role) {
      console.error("Role not found");
      this.dialogRef.close(null);
      return;
    }
    this.originalRole = { ...role };
    this.editedRole =  { ...role };
  }

  /** Handle department select changes */
  handleDepartmentChange(departmentId: number): void {
    this.editedRole.departmentId = departmentId;
  }

  /** Handle department name input changes */
  handleRoleNameChange(newValue: string): void {
    this.editedRole.roleName = newValue.toUpperCase();
  }

  /** Save Changes */
  saveChanges(): void {
    this.isLoading = true;
    this._roleService.updateRole(this.editedRole);
    this._roleService.notifyRolesChanged();
    this._snackbarService.success("Role saved.");
    this.isLoading = false;
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
