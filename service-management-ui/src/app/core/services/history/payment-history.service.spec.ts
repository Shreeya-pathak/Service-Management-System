import { TestBed } from '@angular/core/testing';

import { PaymentHistoryServiceTs } from './payment-history.service.js';

describe('PaymentHistoryServiceTs', () => {
  let service: PaymentHistoryServiceTs;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaymentHistoryServiceTs);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
