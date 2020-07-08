import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareExamComponent } from './share-exam.component';

describe('ShareExamComponent', () => {
  let component: ShareExamComponent;
  let fixture: ComponentFixture<ShareExamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShareExamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareExamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
