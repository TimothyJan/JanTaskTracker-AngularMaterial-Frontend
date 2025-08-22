export class ProjectTask {
  projectTaskId: number;
  projectId: number;
  name: string;
  description: string;
  status: "Not Started" | "Active" | "Completed";
  startDate?: Date;
  dueDate?: Date;
  assignedEmployeeIds?: number[] | null;

  constructor(
    projectTaskId: number,
    projectId: number,
    name: string,
    description: string,
    status: "Not Started" | "Active" | "Completed",
    startDate?: Date,
    dueDate?: Date,
    assignedEmployeeIds?: number[] | null,
  ) {
    this.projectTaskId = projectTaskId;
    this.projectId = projectId,
    this.name = name,
    this.description = description,
    this.status = status,
    this.startDate = startDate,
    this.dueDate = dueDate,
    this.assignedEmployeeIds = assignedEmployeeIds
  }
}
