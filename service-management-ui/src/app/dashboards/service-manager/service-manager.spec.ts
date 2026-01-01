import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceManager } from './service-manager';

describe('ServiceManager', () => {
  let component: ServiceManager;
  let fixture: ComponentFixture<ServiceManager>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceManager]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceManager);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
