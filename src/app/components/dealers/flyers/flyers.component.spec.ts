import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlyersComponent } from './flyers.component';

describe('FlyersComponent', () => {
  let component: FlyersComponent;
  let fixture: ComponentFixture<FlyersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlyersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FlyersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
