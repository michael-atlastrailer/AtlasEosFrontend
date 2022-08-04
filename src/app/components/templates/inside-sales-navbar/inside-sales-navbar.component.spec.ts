import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsideSalesNavbarComponent } from './inside-sales-navbar.component';

describe('InsideSalesNavbarComponent', () => {
  let component: InsideSalesNavbarComponent;
  let fixture: ComponentFixture<InsideSalesNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsideSalesNavbarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsideSalesNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
