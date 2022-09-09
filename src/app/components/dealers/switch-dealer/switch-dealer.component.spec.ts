import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwitchDealerComponent } from './switch-dealer.component';

describe('SwitchDealerComponent', () => {
  let component: SwitchDealerComponent;
  let fixture: ComponentFixture<SwitchDealerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SwitchDealerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SwitchDealerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
