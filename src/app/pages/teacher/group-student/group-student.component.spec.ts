import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupStudentComponent } from './group-student.component';

describe('GroupStudentComponent', () => {
  let component: GroupStudentComponent;
  let fixture: ComponentFixture<GroupStudentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupStudentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
