import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

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
export class InputComponent implements OnInit{
  @Input() value: string = "";
  @Input() label: string = "text";
  placeholder: string = "";

  @Output() valueChanged = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
    this.placeholder = `Enter ${this.label} here`;
  }

  onInputChange(event: any) {
    this.value = event.target.value;
    this.valueChanged.emit(this.value);
  }

}
