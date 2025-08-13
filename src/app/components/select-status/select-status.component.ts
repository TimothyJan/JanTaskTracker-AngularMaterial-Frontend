import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-select-status',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './select-status.component.html',
  styleUrl: './select-status.component.css',
  standalone: true
})
export class SelectStatusComponent {
  @Input() value: string = "";
  @Output() statusChanged = new EventEmitter<string>();

  statuses: string[] = ["Not Started", "Active", "Completed",];
  selectedStatus: string | null = null;

  constructor() {}

  /** on status change, emit value */
  onStatusChange(event: MatSelectChange): void {
    this.statusChanged.emit(event.value);
  }

}
