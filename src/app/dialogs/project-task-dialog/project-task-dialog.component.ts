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
  form: FormGroup = new FormGroup({
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

  /** Assigns projectId to form */
  assignProjectId(): void {
    this.isLoading = true;
    this.form.controls["projectId"].setValue(this.data.projectId);
    this.isLoading = false;
  }

  /** Set form using getProjectTaskById */
  setProjectTaskFormValues(): void {
    this.isLoading = true;
    const formValues = this._projectTaskService.getProjectTaskById(this.data.projectTaskId!);
    this.form.patchValue({
      projectTaskId: formValues.projectTaskId,
      projectId: formValues.projectId,
      title: formValues.title,
      description: formValues.description,
      status: formValues.status,
      startDate: formValues.startDate,
      dueDate: formValues.dueDate,
      assignedEmployeeIds: formValues.assignedEmployeeIds,
    })
    this.isLoading = false;
  }

  /** Handles task change from input component and assigns title to form */
  handleTitleChange(title: string): void {
    this.form.patchValue({ title: title });
  }

  /** Handles description change from text area component and assigns description to form */
  handleDescriptionChange(description: string): void {
    this.form.patchValue({ description: description });
  }

  /** Handles status change from status selector component and assigns status to form */
  handleStatusChange(status: string): void {
    this.form.patchValue({ status: status });
  }

  /** Handles startDate change from date-selector component and assigns date value to form */
  handleStartDateSelection(selectedDate: Date): void {
    this.form.patchValue({ startDate: selectedDate });
  }

  /** Handles dueDate change from date-selector component and assigns date value to form */
  handleDueDateSelection(selectedDate: Date): void {
    this.form.patchValue({ dueDate: selectedDate });
  }

  /** Handles assign employees change from assign-employees component and assigns list of employeeIds to form */
  handleEmployeeSelection(selectedEmployeeIds: any) {
    this.form.controls['assignedEmployeeIds'].setValue(selectedEmployeeIds);
  }

  /** Cancel and close modal */
  cancel() {
    this.dialogRef.close(null);
  }

  /** Confirm save and close modal */
  confirm() {
    if(this.form.valid) {
      if (this.form.get("projectTaskId")?.value == 0) {
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
      this.form.controls["projectId"].value,
      this.form.controls["title"].value,
      this.form.controls["description"].value,
      this.form.controls["status"].value,
      this.form.controls["startDate"].value,
      this.form.controls["dueDate"].value,
      this.form.controls["assignedEmployeeIds"].value
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
      this.data.projectTaskId!,
      this.form.controls["projectId"].value,
      this.form.controls["title"].value,
      this.form.controls["description"].value,
      this.form.controls["status"].value,
      this.form.controls["startDate"].value,
      this.form.controls["dueDate"].value,
      this.form.controls["assignedEmployeeIds"].value
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
