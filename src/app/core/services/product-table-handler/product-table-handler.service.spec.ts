import { TestBed } from '@angular/core/testing';

import { ProductTableHandlerService } from './product-table-handler.service';

describe('ProductTableHandlerService', () => {
  let service: ProductTableHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductTableHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
