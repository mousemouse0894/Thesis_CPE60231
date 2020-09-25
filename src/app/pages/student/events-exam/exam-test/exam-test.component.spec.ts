import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamTestComponent } from './exam-test.component';

describe('ExamTestComponent', () => {
  let component: ExamTestComponent;
  let fixture: ComponentFixture<ExamTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExamTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
