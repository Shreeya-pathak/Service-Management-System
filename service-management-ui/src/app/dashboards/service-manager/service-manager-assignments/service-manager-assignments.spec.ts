import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceManagerAssignments } from './service-manager-assignments';

describe('ServiceManagerAssignments', () => {
  let component: ServiceManagerAssignments;
  let fixture: ComponentFixture<ServiceManagerAssignments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceManagerAssignments]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceManagerAssignments);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
