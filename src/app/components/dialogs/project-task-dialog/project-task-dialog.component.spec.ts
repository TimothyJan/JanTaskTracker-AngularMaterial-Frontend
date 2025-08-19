import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectTaskDialogComponent } from './project-task-dialog.component';

describe('ProjectTaskDialogComponent', () => {
  let component: ProjectTaskDialogComponent;
  let fixture: ComponentFixture<ProjectTaskDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectTaskDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectTaskDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
