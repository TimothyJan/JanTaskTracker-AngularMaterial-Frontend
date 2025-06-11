import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Project } from '../models/project.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private projectsChangedSource = new Subject<void>();  // Emit events when department is added/changed
  projectsChanged$ = this.projectsChangedSource.asObservable();

  projectId: number = 3;

  private projects: Project[] = [
    new Project(1, 'Project Alpha', 'First project', 'Active', new Date('2024-11-13'), new Date('2025-11-13')),
    new Project(2, 'Project Beta', 'Second project', 'Active', new Date('2024-11-13'), new Date('2025-1-13')),
  ];

  constructor() {}

  // Get all projects
  getProjects(): Project[] {
    return this.projects;
  }

  /** Get list of all projectIds */
  getListOfProjectIds(): number[] {
    let listOfProjectIds: number[] = [];
    this.projects.forEach((project) => {
      listOfProjectIds.push(project.projectId);
    });
    return listOfProjectIds;
  }

  // Get a project by Id
  getProjectById(projectId: number): Project {
    return this.projects.find((project) => project.projectId === projectId)!;
  }

  // Add a new project
  createProject(newProject: Project): void {
    newProject.projectId = this.projectId++;
    this.projects.push(newProject);
    this.projectsChangedSource.next();
  }

  // Update an existing project
  updateProject(updatedProject: Project): void {
    const index = this.projects.findIndex((project) => project.projectId === updatedProject.projectId);
    if (index !== -1) {
      this.projects[index] = updatedProject;
      this.projectsChangedSource.next();
    }
  }

  // Delete a project
  deleteProject(projectId: number): void {
    const index = this.projects.findIndex(project => project.projectId === projectId);
    if (index !== -1) {
      this.projects.splice(index, 1);
      this.projectsChangedSource.next(); // Notify subscribers that the project list has changed
    }
  }

  /** Emit events for projects update */
  notifyProjectsChanged(): void {
    this.projectsChangedSource.next();
  }
}
