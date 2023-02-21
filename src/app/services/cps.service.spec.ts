import { TestBed } from '@angular/core/testing';

import { CpsService } from './cps.service';

describe('CpsService', () => {
  let service: CpsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CpsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
