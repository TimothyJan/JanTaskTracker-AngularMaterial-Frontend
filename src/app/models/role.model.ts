export class Role {
  id: number = 0;
  roleName: string = "";
  departmentId: number = 0;

  constructor(id: number, roleName: string, departmentId: number = 0,) {
    this.id = id;
    this.roleName = roleName;
    this.departmentId = departmentId;
  }
}
