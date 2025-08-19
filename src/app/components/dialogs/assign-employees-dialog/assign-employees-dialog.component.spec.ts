import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignEmployeesDialogComponent } from './assign-employees-dialog.component';

describe('AssignEmployeesDialogComponent', () => {
  let component: AssignEmployeesDialogComponent;
  let fixture: ComponentFixture<AssignEmployeesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignEmployeesDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignEmployeesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
