import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { DepartmentService } from '../../../services/department.service';
import { Department } from '../../../models/department.model';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule}  from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { SnackbarService } from '../../../services/snackbar.service';
import { MatDialog } from '@angular/material/dialog';
import { DepartmentEditComponent } from '../../../components/dialogs/department-edit/department-edit.component';

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
  private snackbar = inject(SnackbarService)
  departments: Department[] = [];

  constructor(
    private _departmentService: DepartmentService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadDepartments();
  }

  /** Load all departmetns */
  loadDepartments(): void {
    this.departments = this._departmentService.getDepartments();
  }

  /** Open Department Edit dialog */
  onOpenEditDialog(departmentId: number): void {
    this.dialog.open(DepartmentEditComponent, {
      width: '400px',
      data: { departmentId }
    });
  }

  /** Delete Department */
  onDelete(departmentId: number): void {
    const confirmDelete = confirm('Are you sure you want to delete this department?');
    if (confirmDelete) {
      this._departmentService.deleteDepartment(departmentId);
      this.loadDepartments();
      this.snackbar.success("Department deleted.");
    }
  }

}
