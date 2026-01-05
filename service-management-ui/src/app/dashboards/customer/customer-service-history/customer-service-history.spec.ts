import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerServiceHistory } from './customer-service-history';

describe('CustomerServiceHistory', () => {
  let component: CustomerServiceHistory;
  let fixture: ComponentFixture<CustomerServiceHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerServiceHistory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerServiceHistory);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
