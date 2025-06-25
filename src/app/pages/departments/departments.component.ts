import { Component } from '@angular/core';
import { DepartmentCreateComponent } from "./department-create/department-create.component";
import { DepartmentListComponent } from "./department-list/department-list.component";

@Component({
  selector: 'app-departments',
  imports: [DepartmentCreateComponent, DepartmentListComponent],
  templateUrl: './departments.component.html',
  styleUrl: './departments.component.css',
  standalone: true
})
export class DepartmentsComponent {

}
