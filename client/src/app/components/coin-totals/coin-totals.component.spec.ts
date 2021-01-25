import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoinTotalsComponent } from './coin-totals.component';

describe('CoinTotalsComponent', () => {
  let component: CoinTotalsComponent;
  let fixture: ComponentFixture<CoinTotalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoinTotalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoinTotalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
