import { CommonModule } from '@angular/common';
import { Component, inject, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Employee } from '../../../models/employee.model';
import { ProjectTask } from '../../../models/project-task.model';
import { Subject } from 'rxjs';

import { EmployeeService } from '../../../services/employee.service';
import { ProjectTaskService } from '../../../services/project-task.service';

import { MatCardModule } from '@angular/material/card';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-assign-employees-dialog',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatListModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './assign-employees-dialog.component.html',
  styleUrl: './assign-employees-dialog.component.css',
  standalone: true
})
export class AssignEmployeesDialogComponent implements OnInit, OnDestroy {
  private _projectTaskService = inject(ProjectTaskService);
  private _employeeService = inject(EmployeeService);
  private unsubscribe$ = new Subject<void>();

  isLoading: boolean = false;
  projectTask: ProjectTask = new ProjectTask(0, 0, "", "", "Not Started", new Date(), new Date(), []);
  employeeList: Employee[] = [];
  selectedEmployees: number[] = [];

  constructor(
    private dialogRef: MatDialogRef<AssignEmployeesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { projectTaskId: number },
  ) {}

  ngOnInit(): void {
    this.getProjectTaskById(this.data.projectTaskId);
    this.getEmployees();
    // Initialize with currently assigned employees
    if (this.projectTask.assignedEmployeeIds) {
      this.selectedEmployees = [...this.projectTask.assignedEmployeeIds];
    }
  }

  /** Get Project Task by Id */
  getProjectTaskById(projectTaskId: number): void {
    this.isLoading = true;
    this.projectTask = this._projectTaskService.getProjectTaskById(projectTaskId);
    this.isLoading = false;
  }

  /** Get Employees */
  getEmployees(): void {
    this.isLoading = true;
    this.employeeList = this._employeeService.getEmployees();
    this.isLoading = false;
  }

  /** Check if employee is selected */
  isEmployeeSelected(employeeId: number): boolean {
    return this.selectedEmployees.includes(employeeId);
  }

  /** Save the assigned employees */
  saveAssignments(): void {
    this.isLoading = true;
    this.projectTask.assignedEmployeeIds = this.selectedEmployees;
    this._projectTaskService.updateProjectTask(this.projectTask);
    this._projectTaskService.notifyProjectTasksChanged();
    this.isLoading = false;
    this.dialogRef.close(this.selectedEmployees);
  }

  /** Cancel and close dialog */
  cancel(): void {
    this.dialogRef.close(null);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
