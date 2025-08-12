import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Department } from '../../models/department.model';

import { DepartmentService } from '../../services/department.service';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-select-department',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './select-department.component.html',
  styleUrl: './select-department.component.css',
  standalone: true
})
export class SelectDepartmentComponent implements OnInit {
  private _departmentService = inject(DepartmentService);
  @Input() departmentId: number | null = null;
  @Output() departmentChanged = new EventEmitter<number>();

  departments: Department[] = [];
  selectedDepartmentId: number | null = null;

  constructor() {}

  ngOnInit(): void {
    this.getDepartments();
    // Set initial value if provided
    if (this.departmentId !== null) {
      this.selectedDepartmentId = this.departmentId;
    }
  }

  /** Get all departments */
  getDepartments(): void {
    this.departments = this._departmentService.getDepartments();
  }

  /** On department change, emit value */
  onDepartmentChange(event: MatSelectChange) {
    const departmentId = Number(event.value);
    this.selectedDepartmentId = departmentId;
    this.departmentChanged.emit(departmentId);
  }
}
