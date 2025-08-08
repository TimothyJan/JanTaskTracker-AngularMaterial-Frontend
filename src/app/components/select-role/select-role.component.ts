import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RoleService } from '../../services/role.service';
import { Role } from '../../models/role.model';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-select-role',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './select-role.component.html',
  styleUrl: './select-role.component.css',
  standalone: true
})
export class SelectRoleComponent implements OnInit, OnChanges {
  private _roleService = inject(RoleService);

  @Input() departmentId: number | null = null;
  @Input() roleId: number | null = null;
  @Output() roleChanged = new EventEmitter<number>();

  roles: Role[] = [];
  selectedRoleId: number | null = null;

  constructor() {}

  ngOnInit(): void {
    this.getRoles();
    this.setSelectedRole();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['departmentId'] && !changes['departmentId'].firstChange) {
      this.getRoles();
    }
    if (changes['roleId']) {
      this.setSelectedRole();
    }
  }

  /** Load roles based on current departmentId */
  getRoles(): void {
    if (this.departmentId !== null) {
      this.roles = this._roleService.getRolesFromDepartmentId(this.departmentId);
      this.selectedRoleId = null; // Reset selection when department changes
    } else {
      this.roles = [];
      this.selectedRoleId = null;
    }
  }

  /** Set the selected role based on input roleId */
  setSelectedRole(): void {
    if (this.roleId !== null && this.roles.some(role => role.roleId === this.roleId)) {
      this.selectedRoleId = this.roleId;
    } else {
      this.selectedRoleId = null;
    }
  }

  /** On role change, emit value */
  onRoleChange(event: MatSelectChange): void {
    const roleId = Number(event.value);
    this.selectedRoleId = roleId;
    this.roleChanged.emit(roleId);
  }
}
