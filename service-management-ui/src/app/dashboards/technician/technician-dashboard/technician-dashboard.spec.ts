import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicianDashboardComponent } from './technician-dashboard';

describe('TechnicianDashboard', () => {
  let component: TechnicianDashboardComponent;
  let fixture: ComponentFixture<TechnicianDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TechnicianDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TechnicianDashboardComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
