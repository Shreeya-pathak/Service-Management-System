import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicianComponent } from './technician';

describe('Technician', () => {
  let component: TechnicianComponent;
  let fixture: ComponentFixture<TechnicianComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TechnicianComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TechnicianComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
