export class Employee {
  id: number = 0;
  name: string = "";
  salary: number = 0;
  departmentId: number = 0;
  roleId: number = 0;

  constructor(id: number, name: string, salary: number, departmentId: number, roleId: number) {
    this.id = id;
    this.name = name;
    this.salary = salary;
    this.departmentId = departmentId;
    this.roleId = roleId;
  }
}
