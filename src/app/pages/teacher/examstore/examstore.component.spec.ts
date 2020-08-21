import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamstoreComponent } from './examstore.component';

describe('ExamstoreComponent', () => {
  let component: ExamstoreComponent;
  let fixture: ComponentFixture<ExamstoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExamstoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamstoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
