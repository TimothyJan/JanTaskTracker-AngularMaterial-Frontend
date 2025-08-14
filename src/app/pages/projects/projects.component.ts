import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectComponent } from "./project/project.component";
import { ProjectDialogComponent } from '../../components/dialogs/project-dialog/project-dialog.component';

import { ProjectService } from '../../services/project.service';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from "@angular/material/menu";
import { MatListModule } from '@angular/material/list';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-projects',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatMenuModule,
    MatListModule,
    ProjectComponent
],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})
export class ProjectsComponent implements OnInit {
  private _projectService = inject(ProjectService);
  listOfProjectIds: number[] = [];

  constructor(
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getListOfProjectIds();

    // Subscribe to changes in projects, specifically for deletion
    this._projectService.projectsChanged$.subscribe(() => {
      this.getListOfProjectIds();
    });
  }

  /** Get list of ProjectIds */
  getListOfProjectIds(): void {
    this.listOfProjectIds = this._projectService.getListOfProjectIds();
  }

  /** Open Project Create Dialog */
  openProjectCreateDialog(): void {
    this.dialog.open(ProjectDialogComponent, {
      width: '500px',
      data: { projectId: -1}
    });
  }
}
