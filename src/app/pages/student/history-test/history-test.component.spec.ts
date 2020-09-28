import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryTestComponent } from './history-test.component';

describe('HistoryTestComponent', () => {
  let component: HistoryTestComponent;
  let fixture: ComponentFixture<HistoryTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoryTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
