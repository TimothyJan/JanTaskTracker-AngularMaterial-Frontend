import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.css'
})
export class DatePickerComponent {
  @Input() label: string = "Date";
  @Input() initialDate?: Date | null = null;
  @Output() dateSelected = new EventEmitter<Date>();

  // Unique ID for each datepicker instance
  pickerId = `datepicker-${Math.random().toString(36).substring(2, 9)}`;

  /** Handle date selection changes */
  onDateChange(date: Date) {
    this.dateSelected.emit(date);
  }
}
