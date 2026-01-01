import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserApprovalPending } from './user-approval-pending';

describe('UserApprovalPending', () => {
  let component: UserApprovalPending;
  let fixture: ComponentFixture<UserApprovalPending>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserApprovalPending]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserApprovalPending);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
