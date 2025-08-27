import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectComponent } from "./project/project.component";
import { ProjectDialogComponent } from '../../dialogs/project-dialog/project-dialog.component';
import { Subject, takeUntil } from 'rxjs';

import { ProjectService } from '../../services/project.service';

import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from "@angular/material/grid-list";
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from "@angular/material/menu";
import { MatListModule } from '@angular/material/list';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-projects',
  imports: [
    CommonModule,
    MatCardModule,
    MatGridListModule,
    MatButtonModule,
    MatMenuModule,
    MatListModule,
    ProjectComponent
],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css',
  standalone: true
})
export class ProjectsComponent implements OnInit, OnDestroy {
  private _projectService = inject(ProjectService);
  private unsubscribe$ = new Subject<void>();

  isLoading: boolean = false;
  listOfProjectIds: number[] = [];

  constructor(
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getListOfProjectIds();
  }

  /** Get list of ProjectIds */
  getListOfProjectIds(): void {
    this.isLoading = true;
    this.listOfProjectIds = this._projectService.getListOfProjectIds();
    this.isLoading = false;

    // Subscribe to changes in projects, specifically for deletion
    this._projectService.projectsChanged$
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(() => {
      this.getListOfProjectIds();
    });
  }

  /** Open Project Create Dialog */
  openProjectCreateDialog(): void {
    this.dialog.open(ProjectDialogComponent, {
      width: '500px',
      data: { }
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
