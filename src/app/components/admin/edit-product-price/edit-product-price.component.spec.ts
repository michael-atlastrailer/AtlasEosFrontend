import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProductPriceComponent } from './edit-product-price.component';

describe('EditProductPriceComponent', () => {
  let component: EditProductPriceComponent;
  let fixture: ComponentFixture<EditProductPriceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditProductPriceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditProductPriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
