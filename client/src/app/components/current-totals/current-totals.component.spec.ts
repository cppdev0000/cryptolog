import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentTotalsComponent } from './current-totals.component';

describe('CurrentTotalsComponent', () => {
  let component: CurrentTotalsComponent;
  let fixture: ComponentFixture<CurrentTotalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentTotalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentTotalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
