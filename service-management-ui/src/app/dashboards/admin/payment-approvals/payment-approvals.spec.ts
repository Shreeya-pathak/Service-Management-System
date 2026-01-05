import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentApprovals } from './payment-approvals';

describe('PaymentApprovals', () => {
  let component: PaymentApprovals;
  let fixture: ComponentFixture<PaymentApprovals>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentApprovals]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentApprovals);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
