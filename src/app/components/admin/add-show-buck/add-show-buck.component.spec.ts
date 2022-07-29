import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddShowBuckComponent } from './add-show-buck.component';

describe('AddShowBuckComponent', () => {
  let component: AddShowBuckComponent;
  let fixture: ComponentFixture<AddShowBuckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddShowBuckComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddShowBuckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
