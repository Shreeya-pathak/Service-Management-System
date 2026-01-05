import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceManagerDashboardComponent } from './service-manager-dashboard';

describe('ServiceManagerDashboard', () => {
  let component: ServiceManagerDashboardComponent;
  let fixture: ComponentFixture<ServiceManagerDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceManagerDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceManagerDashboardComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
