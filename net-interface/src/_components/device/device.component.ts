import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Device } from 'src/_interfaces/device';
import { CentralApiService } from '../../_services/central-api.service';


@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.css']
})
export class DeviceComponent implements OnInit {

  devices: Array < Device > = [];
  errorMessage: string | undefined;

  constructor(
    private actRoute: ActivatedRoute,
    private central: CentralApiService,
    private router: Router,

  ) {
    this.actRoute.params.subscribe((params) => {
      this.devices = params.devices;
    });
  }

  ngOnInit(): void {}

  getDevices() {
    this.central.getDevices().subscribe((devices) => {
            this.devices = devices;
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
