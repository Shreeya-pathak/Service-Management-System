import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { approvalGuard } from './approval-guard';

describe('approvalGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => approvalGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
