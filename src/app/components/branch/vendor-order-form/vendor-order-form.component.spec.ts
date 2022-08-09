import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorOrderFormComponent } from './vendor-order-form.component';

describe('VendorOrderFormComponent', () => {
  let component: VendorOrderFormComponent;
  let fixture: ComponentFixture<VendorOrderFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorOrderFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorOrderFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
