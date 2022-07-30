import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllShowBucksComponent } from './all-show-bucks.component';

describe('AllShowBucksComponent', () => {
  let component: AllShowBucksComponent;
  let fixture: ComponentFixture<AllShowBucksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllShowBucksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllShowBucksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
