import { Component, OnInit } from '@angular/core';
import { Device } from '../../_interfaces/device';
import { ActivatedRoute, Router } from '@angular/router';
import { Feature } from '../../_interfaces/feature';
import { CentralApiService } from '../../_services/central-api.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-device-details',
  templateUrl: './device-details.component.html',
  styleUrls: ['./device-details.component.scss']
})
export class DeviceDetailsComponent implements OnInit {

  device!: Device;
  deviceId!: string;
  features!: Feature;
  errorMessage: string | undefined;

  constructor(
    private actRoute: ActivatedRoute,
    private central: CentralApiService,
    private router: Router,
  ) {
    this.actRoute.params.subscribe((params) => {
      this.deviceId = params.deviceId;
    });
  }

  
  ngOnInit() {
    this.getDevice()
    this.getDeviceFeatures()
  }

  getDevice() {
    this.central.getDeviceById(this.deviceId).subscribe((device) => {
            this.device = device
            console.log(this.device)
        },
        (error) => {
            if (error.status == 404) {
                this.router.navigate(['']);
            }
            this.errorMessage = error.message;
        }
    );
  }

  getDeviceFeatures() {
    console.log(this.deviceId.toString())
    this.central.getFeaturesByDevice(this.deviceId).subscribe((features) => {
      this.features = features;
      console.log(this.features)
      },
      (error) => {
        if (error.status == 404) {
          this.router.navigate(['']);
        }
        this.errorMessage = error.message;
      }
    );
  }

}
