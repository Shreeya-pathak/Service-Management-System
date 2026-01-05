import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicianRequests } from './technician-requests';

describe('TechnicianRequests', () => {
  let component: TechnicianRequests;
  let fixture: ComponentFixture<TechnicianRequests>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TechnicianRequests]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TechnicianRequests);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
