import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceDetailsSwitchComponent } from './device-details-switch.component';

describe('DeviceDetailsSwitchComponent', () => {
  let component: DeviceDetailsSwitchComponent;
  let fixture: ComponentFixture<DeviceDetailsSwitchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeviceDetailsSwitchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceDetailsSwitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
