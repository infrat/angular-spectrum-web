import { TestBed } from '@angular/core/testing';

import { ChartConfigurationService } from './chart.configuration.service';

describe('ChartConfigurationService', () => {
  let service: ChartConfigurationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChartConfigurationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
