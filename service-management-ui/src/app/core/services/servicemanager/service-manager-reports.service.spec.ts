import { TestBed } from '@angular/core/testing';

import { ServiceManagerReportsService } from './service-manager-reports.service';

describe('ServiceManagerReportsService', () => {
  let service: ServiceManagerReportsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceManagerReportsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
