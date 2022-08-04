import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutsideSalesNavbarComponent } from './outside-sales-navbar.component';

describe('OutsideSalesNavbarComponent', () => {
  let component: OutsideSalesNavbarComponent;
  let fixture: ComponentFixture<OutsideSalesNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OutsideSalesNavbarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OutsideSalesNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
