import { Component, Inject, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SnackbarService } from '../../../services/snackbar.service';
import { Role } from '../../../models/role.model';
import { RoleService } from '../../../services/role.service';
import { InputComponent } from '../../input/input.component';
import { SelectDepartmentComponent } from "../../select-department/select-department.component";

import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-role-edit',
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    InputComponent,
    SelectDepartmentComponent
],
  templateUrl: './role-edit.component.html',
  styleUrl: './role-edit.component.css',
  standalone: true
})
export class RoleEditComponent implements OnInit {
  private _snackbarService = inject(SnackbarService);
  private _roleService = inject(RoleService);

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
    const role = this._roleService.getRoleById(this.data.roleId);
    if (!role) {
      console.error("Role not found");
      this.dialogRef.close(null);
      return;
    }
    this.originalRole = { ...role };
    this.editedRole =  { ...role };
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

  /** Save Changes */
  saveChanges(): void {
    this._roleService.updateRole(this.editedRole);
    this._roleService.notifyRolesChanged();
    this._snackbarService.success("Role saved.");
  }

  /** Handle department select changes */
  handleDepartmentChange(departmentId: number): void {
    this.editedRole.departmentId = departmentId;
  }

  /** Handle department name input changes */
  handleRoleNameChange(newValue: string): void {
    this.editedRole.roleName = newValue.toUpperCase();
  }
}
