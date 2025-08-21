import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { ProjectTask } from '../../../models/project-task.model';
import { AssignedEmployeesComponent } from "../../../components/assigned-employees/assigned-employees.component";
import { Subject, takeUntil } from 'rxjs';
import { ProjectTaskDialogComponent } from '../../../dialogs/project-task-dialog/project-task-dialog.component';

import { SnackbarService } from '../../../services/snackbar.service';
import { ProjectTaskService } from '../../../services/project-task.service';

import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-project-task',
  imports: [
    CommonModule,
    MatCardModule,
    MatGridListModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    AssignedEmployeesComponent,
    MatProgressSpinnerModule
],
  templateUrl: './project-task.component.html',
  styleUrl: './project-task.component.css',
  standalone: true
})
export class ProjectTaskComponent implements OnInit{
  private _snackbarService = inject(SnackbarService);
  private _projectTaskService = inject(ProjectTaskService);
  private unsubscribe$ = new Subject<void>();
  @Input() projectTaskId: number = 0;
  isLoading: boolean = false;
  projectTask: ProjectTask = new ProjectTask(0, 0, "", "", "Not Started", new Date(), new Date(), []);

  constructor(
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getProjectTaskById();
  }

  /** Get ProjectTask by Id */
  getProjectTaskById(): void {
    this.isLoading = true;
    this.projectTask = this._projectTaskService.getProjectTaskById(this.projectTaskId);
    this.isLoading = false;

    // Subscribe to the project notifications
    this._projectTaskService.projectTasksChanged$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.getProjectTaskById(); // Reload projectTask with updates
      });
  }

  /** Opens Project Task Edit Dialog */
  async openProjectTaskEditDialog() {
    this.dialog.open(ProjectTaskDialogComponent, {
      width: '500px',
      data: { projectTaskId: this.projectTask.projectTaskId }
    });
  }

  /** Delete ProjectTask */
  onDelete(): void {
    const confirmDelete = confirm('Are you sure you want to delete this projectTask?');
    if (confirmDelete) {
      this.isLoading = true;
      this._projectTaskService.deleteProjectTask(this.projectTaskId);
      this.isLoading = false;
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
