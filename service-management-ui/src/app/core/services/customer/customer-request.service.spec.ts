import { TestBed } from '@angular/core/testing';

import { CustomerRequestService } from './customer-request.service';

describe('CustomerRequestService', () => {
  let service: CustomerRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
