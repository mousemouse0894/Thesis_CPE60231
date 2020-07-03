import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogStudentComponent } from './log-student.component';

describe('LogStudentComponent', () => {
  let component: LogStudentComponent;
  let fixture: ComponentFixture<LogStudentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogStudentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
