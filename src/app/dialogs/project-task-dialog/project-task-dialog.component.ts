import { CommonModule } from '@angular/common';
import { Component, Inject, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { DatePickerComponent } from '../../components/date-picker/date-picker.component';
import { InputComponent } from '../../components/input/input.component';
import { SelectStatusComponent } from '../../components/select-status/select-status.component';
import { ProjectTask } from '../../models/project-task.model';

import { SnackbarService } from '../../services/snackbar.service';
import { ProjectTaskService } from '../../services/project-task.service';

import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-project-task-dialog',
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    InputComponent,
    SelectStatusComponent,
    DatePickerComponent,
    MatProgressSpinnerModule
],
  templateUrl: './project-task-dialog.component.html',
  styleUrl: './project-task-dialog.component.css',
  standalone: true
})
export class ProjectTaskDialogComponent implements OnInit, OnDestroy {
  private _snackbarService = inject(SnackbarService);
  private _projectTaskService = inject(ProjectTaskService);
  private unsubscribe$ = new Subject<void>();

  isLoading: boolean = false;
  projectTaskForm: FormGroup = new FormGroup({
    projectTaskId: new FormControl(0, [Validators.required, Validators.pattern(/^\d+$/)]),
    projectId: new FormControl(0, [Validators.required, Validators.pattern(/^\d+$/)]),
    title: new FormControl("", [Validators.required, Validators.minLength(2), Validators.maxLength(50)]),
    description: new FormControl("", [Validators.required, Validators.minLength(2), Validators.maxLength(50)]),
    status: new FormControl("", [Validators.required, Validators.minLength(2), Validators.maxLength(50)]),
    startDate: new FormControl(""),
    dueDate: new FormControl(""),
    assignedEmployeeIds: new FormControl([]),
  });

  constructor(
    private dialogRef: MatDialogRef<ProjectTaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { projectId?: number, projectTaskId?: number },
  ) {}

  ngOnInit() {
    if (this.data.projectTaskId) {
      this.setProjectTaskFormValues();
    }
    else {
      this.assignProjectId();
    }
  }

  /** Assigns projectId to projectTaskForm */
  assignProjectId(): void {
    this.isLoading = true;
    this.projectTaskForm.controls["projectId"].setValue(this.data.projectId);
    this.isLoading = false;
  }

  /** Set projectTaskForm using getProjectTaskById */
  setProjectTaskFormValues(): void {
    this.isLoading = true;
    const projectTaskFormValues = this._projectTaskService.getProjectTaskById(this.data.projectTaskId!);
    this.projectTaskForm.patchValue({
      projectTaskId: projectTaskFormValues.projectTaskId,
      projectId: projectTaskFormValues.projectId,
      title: projectTaskFormValues.title,
      description: projectTaskFormValues.description,
      status: projectTaskFormValues.status,
      startDate: projectTaskFormValues.startDate,
      dueDate: projectTaskFormValues.dueDate,
      assignedEmployeeIds: projectTaskFormValues.assignedEmployeeIds,
    })
    this.isLoading = false;
  }

  /** Handles task change from input component and assigns title to projectTaskForm */
  handleTitleChange(title: string): void {
    this.projectTaskForm.patchValue({ title: title });
  }

  /** Handles description change from text area component and assigns description to projectTaskForm */
  handleDescriptionChange(description: string): void {
    this.projectTaskForm.patchValue({ description: description });
  }

  /** Handles status change from status selector component and assigns status to projectTaskForm */
  handleStatusChange(status: string): void {
    this.projectTaskForm.patchValue({ status: status });
  }

  /** Handles startDate change from date-selector component and assigns date value to projectTaskForm */
  handleStartDateSelection(selectedDate: Date): void {
    this.projectTaskForm.patchValue({ startDate: selectedDate });
  }

  /** Handles dueDate change from date-selector component and assigns date value to projectTaskForm */
  handleDueDateSelection(selectedDate: Date): void {
    this.projectTaskForm.patchValue({ dueDate: selectedDate });
  }

  /** Handles assign employees change from assign-employees component and assigns list of employeeIds to projectTaskForm */
  handleEmployeeSelection(selectedEmployeeIds: any) {
    this.projectTaskForm.controls['assignedEmployeeIds'].setValue(selectedEmployeeIds);
  }

  /** Cancel and close modal */
  cancel() {
    this.dialogRef.close(null);
  }

  /** Confirm save and close modal */
  confirm() {
    if(this.projectTaskForm.valid) {
      if (this.projectTaskForm.get("projectTaskId")?.value == 0) {
        this.createProjectTask();
      } else {
        this.updateProjectTask();
      }
      this.dialogRef.close(null);
    } else {
      this._snackbarService.error("Please fill all required fields correctly.");
    }
  }

  /** Create Project Task */
  createProjectTask(): void {
    this.isLoading = true;
    const newProjectTask = new ProjectTask(
      0,
      this.projectTaskForm.controls["projectId"].value,
      this.projectTaskForm.controls["title"].value,
      this.projectTaskForm.controls["description"].value,
      this.projectTaskForm.controls["status"].value,
      this.projectTaskForm.controls["startDate"].value,
      this.projectTaskForm.controls["dueDate"].value,
      this.projectTaskForm.controls["assignedEmployeeIds"].value
    );
    this._projectTaskService.createProjectTask(newProjectTask);
    this._projectTaskService.notifyProjectTasksChanged();
    this._snackbarService.success("Project task created.");
    this.isLoading = false;
  }

  /** Update Project Task */
  updateProjectTask(): void {
    this.isLoading = true;
    const newProjectTask = new ProjectTask(
      0,
      this.projectTaskForm.controls["projectId"].value,
      this.projectTaskForm.controls["title"].value,
      this.projectTaskForm.controls["description"].value,
      this.projectTaskForm.controls["status"].value,
      this.projectTaskForm.controls["startDate"].value,
      this.projectTaskForm.controls["dueDate"].value,
      this.projectTaskForm.controls["assignedEmployeeIds"].value
    );
    this._projectTaskService.updateProjectTask(newProjectTask);
    this._projectTaskService.notifyProjectTasksChanged();
    this._snackbarService.success("Project task updated.");
    this.isLoading = false;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
