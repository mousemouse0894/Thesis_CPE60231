import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatabaseServerComponent } from './database-server.component';

describe('DatabaseServerComponent', () => {
  let component: DatabaseServerComponent;
  let fixture: ComponentFixture<DatabaseServerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatabaseServerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatabaseServerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
