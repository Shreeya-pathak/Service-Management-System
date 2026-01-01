import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalPending } from './approval-pending';

describe('ApprovalPending', () => {
  let component: ApprovalPending;
  let fixture: ComponentFixture<ApprovalPending>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApprovalPending]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovalPending);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
