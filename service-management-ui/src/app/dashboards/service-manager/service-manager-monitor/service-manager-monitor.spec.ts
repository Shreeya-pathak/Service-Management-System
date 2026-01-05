import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceManagerMonitor } from './service-manager-monitor';

describe('ServiceManagerMonitor', () => {
  let component: ServiceManagerMonitor;
  let fixture: ComponentFixture<ServiceManagerMonitor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceManagerMonitor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceManagerMonitor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
