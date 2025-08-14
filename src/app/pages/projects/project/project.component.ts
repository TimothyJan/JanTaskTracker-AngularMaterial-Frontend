import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '../../../models/project.model';
import { ProjectTaskComponent } from "../project-task/project-task.component";
import { ProjectDialogComponent } from '../../../components/dialogs/project-dialog/project-dialog.component';

import { SnackbarService } from '../../../services/snackbar.service';
import { ProjectService } from '../../../services/project.service';
import { ProjectTaskService } from '../../../services/project-task.service';

import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from "@angular/material/grid-list";
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-project',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatGridListModule,
    MatMenuModule,
    MatIconModule,
    ProjectTaskComponent
],
  templateUrl: './project.component.html',
  styleUrl: './project.component.css'
})
export class ProjectComponent implements OnInit {
  private _snackbarService = inject(SnackbarService);
  private _projectService = inject(ProjectService);
  private _projectTaskService = inject(ProjectTaskService);

  @Input() projectId: number = 0;
  project : Project = new Project(0, "", "", "Not Started", new Date(), new Date());
  listOfProjectTaskIds: number[] = [];

  constructor(
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getProjectById();
    this.getListOfProjectTaskIdsByProjectId();

    // Add this subscription for project changes
    this._projectService.projectsChanged$.subscribe(() => {
      this.getProjectById(); // Refresh the project data
    });

    // Subscribe to changes in the task list
    this._projectTaskService.projectTasksChanged$.subscribe(() => {
      this.getListOfProjectTaskIdsByProjectId(); // Refresh the list after a task is deleted
    });
  }

  /** Get Project by Id */
  getProjectById(): void {
    this.project = this._projectService.getProjectById(this.projectId);
  }

  /** Get list of ProjectTaskIds by ProjectId */
  getListOfProjectTaskIdsByProjectId(): void {
    this.listOfProjectTaskIds = this._projectTaskService.getListOfProjectTaskIdsByProjectIds(this.projectId);
  }

  /** Opens Project Edit Dialog */
  async openProjectEditDialog(projectId: number) {
    this.dialog.open(ProjectDialogComponent, {
      width: '500px',
      data: { projectId }
    });
  }

  /** Opens Project Task Create Dialog */
  async openProjectTaskCreateDialog() {

  }

  onDelete(): void {
    const confirmDelete = confirm('Are you sure you want to delete this project?');
    if (confirmDelete) {
      this._projectService.deleteProject(this.project.projectId);
      this._snackbarService.success("Department deleted.");
    }
  }

}
