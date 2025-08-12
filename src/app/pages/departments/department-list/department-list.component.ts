import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Department } from '../../../models/department.model';
import { DepartmentEditComponent } from '../../../components/dialogs/department-edit/department-edit.component';

import { SnackbarService } from '../../../services/snackbar.service';
import { DepartmentService } from '../../../services/department.service';

import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule}  from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-department-list',
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    MatGridListModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule
  ],
  templateUrl: './department-list.component.html',
  styleUrl: './department-list.component.css',
  standalone: true
})
export class DepartmentListComponent implements OnInit{
  private _snackbar = inject(SnackbarService);
  private _departmentService = inject(DepartmentService);
  departments: Department[] = [];

  constructor(
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getDepartments();
    this._departmentService.departmentsChanged$.subscribe(() => {
      this.getDepartments();
    });
  }

  /** Get all departments */
  getDepartments(): void {
    this.departments = this._departmentService.getDepartments();
  }

  /** Open Department Edit dialog */
  onOpenEditDialog(departmentId: number): void {
    this.dialog.open(DepartmentEditComponent, {
      width: '500px',
      data: { departmentId }
    });
  }

  /** Delete Department */
  onDelete(departmentId: number): void {
    const confirmDelete = confirm('Are you sure you want to delete this department?');
    if (confirmDelete) {
      this._departmentService.deleteDepartment(departmentId);
      this.getDepartments();
      this._snackbar.success("Department deleted.");
    }
  }

}
