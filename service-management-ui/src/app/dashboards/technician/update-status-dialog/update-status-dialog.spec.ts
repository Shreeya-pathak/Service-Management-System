import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateStatusDialog } from './update-status-dialog';

describe('UpdateStatusDialog', () => {
  let component: UpdateStatusDialog;
  let fixture: ComponentFixture<UpdateStatusDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateStatusDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateStatusDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
