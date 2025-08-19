import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignedEmployeesComponent } from './assigned-employees.component';

describe('AssignedEmployeesComponent', () => {
  let component: AssignedEmployeesComponent;
  let fixture: ComponentFixture<AssignedEmployeesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignedEmployeesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignedEmployeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
