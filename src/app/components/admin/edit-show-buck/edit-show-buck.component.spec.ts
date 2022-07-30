import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditShowBuckComponent } from './edit-show-buck.component';

describe('EditShowBuckComponent', () => {
  let component: EditShowBuckComponent;
  let fixture: ComponentFixture<EditShowBuckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditShowBuckComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditShowBuckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
