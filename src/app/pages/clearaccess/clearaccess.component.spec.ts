import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClearaccessComponent } from './clearaccess.component';

describe('ClearaccessComponent', () => {
  let component: ClearaccessComponent;
  let fixture: ComponentFixture<ClearaccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClearaccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClearaccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
