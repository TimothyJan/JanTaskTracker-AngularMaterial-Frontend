import { Component } from '@angular/core';
import { DepartmentListComponent } from "./department-list/department-list.component";
import { DepartmentEditComponent } from '../../components/dialogs/department-edit/department-edit.component';

import { MatCardModule } from "@angular/material/card";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-departments',
  imports: [
    DepartmentListComponent,
    MatCardModule,
    MatGridListModule,
    MatButtonModule
],
  templateUrl: './departments.component.html',
  styleUrl: './departments.component.css',
  standalone: true
})
export class DepartmentsComponent {

  constructor(
    private dialog: MatDialog
  ) {}

  /** Open Department Create dialog */
  onOpenDepartmentDialog(): void {
    this.dialog.open(DepartmentEditComponent, {
      width: '500px',
      data: { }
    });
  }

}
