import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovePaymentDialog } from './approve-payment-dialog';

describe('ApprovePaymentDialog', () => {
  let component: ApprovePaymentDialog;
  let fixture: ComponentFixture<ApprovePaymentDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApprovePaymentDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovePaymentDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
