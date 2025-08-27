export class Role {
  id: number = 0;
  name: string = "";
  departmentId: number = 0;

  constructor(id: number, name: string, departmentId: number = 0,) {
    this.id = id;
    this.name = name;
    this.departmentId = departmentId;
  }
}
