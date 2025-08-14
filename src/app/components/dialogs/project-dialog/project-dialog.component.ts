import { CommonModule } from '@angular/common';
import { Component, Inject, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { InputComponent } from '../../input/input.component';
import { DatePickerComponent } from '../../date-picker/date-picker.component';
import { SelectStatusComponent } from '../../select-status/select-status.component';

import { SnackbarService } from '../../../services/snackbar.service';
import { ProjectService } from '../../../services/project.service';

import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Project } from '../../../models/project.model';

@Component({
  selector: 'app-project-dialog',
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    InputComponent,
    DatePickerComponent,
    SelectStatusComponent
  ],
  templateUrl: './project-dialog.component.html',
  styleUrl: './project-dialog.component.css'
})
export class ProjectDialogComponent implements OnInit {
  private _snackbarService = inject(SnackbarService);
  private _projectService = inject(ProjectService);

  projectForm: FormGroup = new FormGroup({
    projectName: new FormControl("", [Validators.required, Validators.minLength(2), Validators.maxLength(50)]),
    description: new FormControl("", [Validators.required, Validators.minLength(2), Validators.maxLength(50)]),
    status: new FormControl("", [Validators.required, Validators.minLength(2), Validators.maxLength(50)]),
    startDate: new FormControl(null),
    dueDate: new FormControl(null),
  });

  constructor(
    private dialogRef: MatDialogRef<ProjectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { projectId: number },
  ) {}

  ngOnInit(): void {
    // Edit Project, else create project
    if(this.data.projectId != -1) {
      this.getProject();
    }
  }

  /** Cancel and close dialog */
  cancel(): void {
    this.dialogRef.close(null);
  }

  /** Confirm create or update project */
  confirm(): void {
    if (this.projectForm.valid) {
      if (this.data.projectId == -1) {
        this.createProject();
      } else {
        this.updateProject();
      }
      this.dialogRef.close(null);
    } else {
      this._snackbarService.error("Please fill all required fields correctly.");
    }
  }

  /** Get Project */
  getProject(): void {
    const project = this._projectService.getProjectById(this.data.projectId);
    if (!project) {
      console.log("Project not found.");
      this.dialogRef.close(null);
      return;
    }
    this.projectForm.patchValue({
      projectName: project.projectName,
      description: project.description,
      status: project.status,
      startDate: project.startDate,
      dueDate: project.dueDate
    });
  }

  /** Create the Project */
  createProject(): void {
    const newProject = new Project(
      0,
      this.projectForm.controls["projectName"].value,
      this.projectForm.controls["description"].value,
      this.projectForm.controls["status"].value,
      this.projectForm.controls["startDate"].value,
      this.projectForm.controls["dueDate"].value,
    );
    this._projectService.createProject(newProject);
    this._projectService.notifyProjectsChanged();
  }

  /** Edit the Project */
  updateProject(): void {
    const editedProject = new Project(
      this.data.projectId,
      this.projectForm.controls["projectName"].value,
      this.projectForm.controls["description"].value,
      this.projectForm.controls["status"].value,
      this.projectForm.controls["startDate"].value,
      this.projectForm.controls["dueDate"].value,
    );
    this._projectService.updateProject(editedProject);
    this._projectService.notifyProjectsChanged();
    this._snackbarService.success("Project saved.");
    console.log(this._projectService.getProjects());
  }

  /** Handle project name input changes */
  handleProjectNameChange(projectName: string): void {
    this.projectForm.patchValue({ projectName });
  }

  /** Handle description input changes */
  handleDescriptionChange(description: string): void {
    this.projectForm.patchValue({ description });
  }

  /** Handle status input changes */
  handleStatusChange(status: string): void {
    this.projectForm.patchValue({ status });
  }

  /** Handles startDate change */
  handleStartDateSelection(selectedDate: Date): void {
    this.projectForm.patchValue({ startDate: selectedDate });
  }

  /** Handles endDate change */
  handleDueDateSelection(selectedDate: Date): void {
    this.projectForm.patchValue({ dueDate: selectedDate });
  }

}
