import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetStartDateComponent } from './set-start-date.component';

describe('SetStartDateComponent', () => {
  let component: SetStartDateComponent;
  let fixture: ComponentFixture<SetStartDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetStartDateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SetStartDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
