import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-input-salary',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './input-salary.component.html',
  styleUrls: ['./input-salary.component.css'],
  standalone: true
})
export class InputSalaryComponent {
  private salaryRegex: RegExp = new RegExp(/^\d*\.?\d{0,2}$/g);
  @Input() value: string = '';
  @Output() valueChanged = new EventEmitter<number>();

  /** Validate salary format */
  // isValid(): boolean {
  //   if (!this.value) return true;
  //   return this.salaryRegex.test(this.value);
  // }

  /** On input change, emit value */
  onInputChange(event: Event) {
    const newValue = Number((event.target as HTMLInputElement).value);
    this.valueChanged.emit(newValue);
  }
}
