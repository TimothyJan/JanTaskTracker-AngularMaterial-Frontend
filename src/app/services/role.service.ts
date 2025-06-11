import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Role } from '../models/role.model';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private rolesChangedSource = new Subject<void>();  // Emit events when role is added
  rolesChanged$ = this.rolesChangedSource.asObservable();

  roleId: number = 10;

  roles: Role[] = [
    new Role(0, "ACCOUNTANT", 0),
    new Role(1, "FINANCIAL ANALYST", 0),
    new Role(2, "FINANCE MANAGER", 0),
    new Role(3, "HR ASSISTANT", 1),
    new Role(4, "HR SPECIALIST", 1),
    new Role(5, "HR DIRECTOR", 1),
    new Role(6, "SOFTWARE ENGINEER", 2),
    new Role(7, "FRONT-END DEVELOPER", 2),
    new Role(8, "BACK-END DEVELOPER", 2),
    new Role(9, "FULL-STACK DEVELOPER", 2),
  ];

  constructor() { }

  /** Get Roles */
  getRoles(): Role[] {
    return this.roles;
  }

  /** Get Roles based on DepartmenIdd */
  getRolesFromDepartmentId(departmentId: number) {
    let departmentRoles = [];
    for(let i=0; i<this.roles.length; i++) {
      if(this.roles[i].departmentId == departmentId) {
        departmentRoles.push(this.roles[i]);
      }
    }
    return departmentRoles
  }

  /** Get Role based on id */
  getRole(id: number): Role | undefined {
    for(let i=0; i<this.roles.length; i++) {
      if(this.roles[i].roleId == id) {
        return this.roles[i];
      }
    }
    return undefined
  }

  /** Post new Role */
  addRole(role: Role): void {
    let newRole = new Role(this.roleId++, role.roleName, role.departmentId);
    this.roles.push(newRole);
    // console.log(this.roles);
  }

  /** Update existing Role based on id */
  updateRole(role: Role): void {
    for(let i=0; i<this.roles.length; i++) {
      if(this.roles[i].roleId == role.roleId) {
        this.roles[i] = role;
      }
    }
  }

  /** Delete Role based on id */
  deleteRole(id: number): void {
    for(let i=0; i<this.roles.length; i++) {
      if(this.roles[i].roleId == id) {
        this.roles.splice(i, 1);
      }
    }
  }

  /** Emit events for roles update */
  notifyRolesChanged(): void {
    this.rolesChangedSource.next();
  }

  /** Checks for duplicate department names */
  checkDuplicates(role: Role): boolean {
    for(let i=0; i<this.roles.length; i++) {
      if(this.roles[i].roleName == role.roleName && this.roles[i].departmentId == role.departmentId) {
        return true;
      }
    }
    return false;
  }
}
