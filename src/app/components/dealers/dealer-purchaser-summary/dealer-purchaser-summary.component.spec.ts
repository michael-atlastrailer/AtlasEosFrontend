import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealerPurchaserSummaryComponent } from './dealer-purchaser-summary.component';

describe('DealerPurchaserSummaryComponent', () => {
  let component: DealerPurchaserSummaryComponent;
  let fixture: ComponentFixture<DealerPurchaserSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DealerPurchaserSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DealerPurchaserSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
