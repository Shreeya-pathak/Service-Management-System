import { TestBed } from '@angular/core/testing';

import { ServiceRequestHistoryService } from './service-request-history.service';

describe('ServiceRequestHistoryService', () => {
  let service: ServiceRequestHistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceRequestHistoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
