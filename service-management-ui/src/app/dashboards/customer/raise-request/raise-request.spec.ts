import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RaiseRequestComponent } from './raise-request';

describe('RaiseRequest', () => {
  let component: RaiseRequestComponent;
  let fixture: ComponentFixture<RaiseRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RaiseRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RaiseRequestComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
