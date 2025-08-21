import { Component } from '@angular/core';
import { DepartmentListComponent } from "./department-list/department-list.component";
import { DepartmentDialogComponent } from '../../dialogs/department-dialog/department-dialog.component';

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
    this.dialog.open(DepartmentDialogComponent, {
      width: '500px',
      data: { }
    });
  }

}
