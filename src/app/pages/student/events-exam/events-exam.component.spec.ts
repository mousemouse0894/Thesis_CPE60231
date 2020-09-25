import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsExamComponent } from './events-exam.component';

describe('EventsExamComponent', () => {
  let component: EventsExamComponent;
  let fixture: ComponentFixture<EventsExamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventsExamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventsExamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
