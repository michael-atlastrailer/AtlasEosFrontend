import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialOrdersComponent } from './special-orders.component';

describe('SpecialOrdersComponent', () => {
  let component: SpecialOrdersComponent;
  let fixture: ComponentFixture<SpecialOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpecialOrdersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
