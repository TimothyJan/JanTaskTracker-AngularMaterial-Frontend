import { Component } from '@angular/core';
import { EmployeeCreateComponent } from "./employee-create/employee-create.component";
import { EmployeeListComponent } from "./employee-list/employee-list.component";

@Component({
  selector: 'app-employees',
  imports: [EmployeeCreateComponent, EmployeeListComponent],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.css',
  standalone: true
})
export class EmployeesComponent {

}
