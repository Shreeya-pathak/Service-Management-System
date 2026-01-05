import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerReports } from './manager-reports';

describe('ManagerReports', () => {
  let component: ManagerReports;
  let fixture: ComponentFixture<ManagerReports>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagerReports]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagerReports);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
