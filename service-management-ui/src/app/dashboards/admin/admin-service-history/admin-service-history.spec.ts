import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminServiceHistory } from './admin-service-history';

describe('AdminServiceHistory', () => {
  let component: AdminServiceHistory;
  let fixture: ComponentFixture<AdminServiceHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminServiceHistory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminServiceHistory);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
