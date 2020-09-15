import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamSetComponent } from './exam-set.component';

describe('ExamSetComponent', () => {
  let component: ExamSetComponent;
  let fixture: ComponentFixture<ExamSetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExamSetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
