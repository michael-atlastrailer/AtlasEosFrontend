import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDealerSummaryComponent } from './view-dealer-summary.component';

describe('ViewDealerSummaryComponent', () => {
  let component: ViewDealerSummaryComponent;
  let fixture: ComponentFixture<ViewDealerSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewDealerSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDealerSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
