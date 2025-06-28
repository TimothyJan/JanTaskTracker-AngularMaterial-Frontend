import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-input',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './input.component.html',
  styleUrl: './input.component.css',
  standalone: true,
})
export class InputComponent {
  @Input() value: string = "";
  @Input() label: string = "text";
  placeholder: string = `Enter ${this.label} here`;

  @Output() valueChanged = new EventEmitter<string>();

  /** On input change, emit value */
  onInputChange(event: Event) {
    const newValue = (event.target as HTMLInputElement).value;
    this.valueChanged.emit(newValue);
  }

}
