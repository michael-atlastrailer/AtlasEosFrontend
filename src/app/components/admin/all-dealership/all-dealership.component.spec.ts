import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllDealershipComponent } from './all-dealership.component';

describe('AllDealershipComponent', () => {
  let component: AllDealershipComponent;
  let fixture: ComponentFixture<AllDealershipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllDealershipComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllDealershipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
