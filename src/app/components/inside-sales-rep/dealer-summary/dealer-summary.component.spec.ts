import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealerSummaryComponent } from './dealer-summary.component';

describe('DealerSummaryComponent', () => {
  let component: DealerSummaryComponent;
  let fixture: ComponentFixture<DealerSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DealerSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DealerSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
