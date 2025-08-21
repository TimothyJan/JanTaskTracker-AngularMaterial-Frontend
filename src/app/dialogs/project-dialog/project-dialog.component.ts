import { CommonModule } from '@angular/common';
import { Component, Inject, inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { DatePickerComponent } from '../../components/date-picker/date-picker.component';
import { InputComponent } from '../../components/input/input.component';
import { SelectStatusComponent } from '../../components/select-status/select-status.component';
import { Project } from '../../models/project.model';

import { SnackbarService } from '../../services/snackbar.service';
import { ProjectService } from '../../services/project.service';

import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-project-dialog',
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    InputComponent,
    DatePickerComponent,
    SelectStatusComponent,
    MatProgressSpinnerModule
  ],
  templateUrl: './project-dialog.component.html',
  styleUrl: './project-dialog.component.css',
  standalone: true
})
export class ProjectDialogComponent implements OnInit, OnDestroy {
  private _snackbarService = inject(SnackbarService);
  private _projectService = inject(ProjectService);
  private unsubscribe$ = new Subject<void>();

  isLoading: boolean = false;
  form: FormGroup = new FormGroup({
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

  /** Get Project */
  getProject(): void {
    this.isLoading = true;
    const project = this._projectService.getProjectById(this.data.projectId);
    if (!project) {
      console.log("Project not found.");
      this.dialogRef.close(null);
      return;
    }
    this.isLoading = false;

    this.form.patchValue({
      projectName: project.projectName,
      description: project.description,
      status: project.status,
      startDate: project.startDate,
      dueDate: project.dueDate
    });
  }

  /** Handle project name input changes */
  handleProjectNameChange(projectName: string): void {
    this.form.patchValue({ projectName });
  }

  /** Handle description input changes */
  handleDescriptionChange(description: string): void {
    this.form.patchValue({ description });
  }

  /** Handle status input changes */
  handleStatusChange(status: string): void {
    this.form.patchValue({ status });
  }

  /** Handles startDate change */
  handleStartDateSelection(selectedDate: Date): void {
    this.form.patchValue({ startDate: selectedDate });
  }

  /** Handles endDate change */
  handleDueDateSelection(selectedDate: Date): void {
    this.form.patchValue({ dueDate: selectedDate });
  }

  /** Create the Project */
  createProject(): void {
    this.isLoading = true;
    const newProject = new Project(
      0,
      this.form.controls["projectName"].value,
      this.form.controls["description"].value,
      this.form.controls["status"].value,
      this.form.controls["startDate"].value,
      this.form.controls["dueDate"].value,
    );
    this._projectService.createProject(newProject);
    this._projectService.notifyProjectsChanged();
    this._snackbarService.success("Project created.");
    this.isLoading = false;
  }

  /** Edit the Project */
  updateProject(): void {
    this.isLoading = true;
    const editedProject = new Project(
      this.data.projectId,
      this.form.controls["projectName"].value,
      this.form.controls["description"].value,
      this.form.controls["status"].value,
      this.form.controls["startDate"].value,
      this.form.controls["dueDate"].value,
    );
    this._projectService.updateProject(editedProject);
    this._projectService.notifyProjectsChanged();
    this._snackbarService.success("Project saved.");
    this.isLoading = false;
  }

  /** Cancel and close dialog */
  cancel(): void {
    this.dialogRef.close(null);
  }

  /** Confirm create or update project */
  confirm(): void {
    if (this.form.valid) {
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

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
