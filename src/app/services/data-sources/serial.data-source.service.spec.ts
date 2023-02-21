import { TestBed } from '@angular/core/testing';

import { SerialDataSourceService } from './serial.data-source.service';

describe('SerialDataSourceService', () => {
  let service: SerialDataSourceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SerialDataSourceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
