import { TestBed } from '@angular/core/testing';

import { ExitSearchGuard } from './exit-search.guard';

describe('ExitSearchGuard', () => {
  let guard: ExitSearchGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ExitSearchGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
