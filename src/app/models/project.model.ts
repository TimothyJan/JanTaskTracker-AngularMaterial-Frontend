export class Project {
  id: number;
  projectName: string;
  description: string;
  status: "Not Started" | "Active" | "Completed";
  startDate?: Date;
  dueDate?: Date;

  constructor(
    id: number,
    projectName: string,
    description: string,
    status: "Not Started" | "Active" | "Completed",
    startDate?: Date,
    dueDate?: Date,
  ) {
    this.id = id;
    this.projectName = projectName;
    this.description = description;
    this.status = status;
    this.startDate = startDate;
    this.dueDate = dueDate;
  }
}
