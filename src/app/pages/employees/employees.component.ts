import { Component } from '@angular/core';
import { EmployeeListComponent } from "./employee-list/employee-list.component";
import { EmployeeDialogComponent } from '../../dialogs/employee-dialog/employee-dialog.component';

import { MatCardModule } from "@angular/material/card";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-employees',
  imports: [
    EmployeeListComponent,
    MatCardModule,
    MatGridListModule,
    MatButtonModule
],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.css',
  standalone: true
})
export class EmployeesComponent {

  constructor(
    private dialog: MatDialog
  ) {}

  onOpenEmployeeDialog(): void {
    this.dialog.open(EmployeeDialogComponent, {
      width: '600px',
      data: { }
    });
  }

}
