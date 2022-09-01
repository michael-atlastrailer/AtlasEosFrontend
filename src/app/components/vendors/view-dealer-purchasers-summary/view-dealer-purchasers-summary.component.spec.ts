import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDealerPurchasersSummaryComponent } from './view-dealer-purchasers-summary.component';

describe('ViewDealerPurchasersSummaryComponent', () => {
  let component: ViewDealerPurchasersSummaryComponent;
  let fixture: ComponentFixture<ViewDealerPurchasersSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewDealerPurchasersSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDealerPurchasersSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
