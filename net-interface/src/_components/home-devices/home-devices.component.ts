import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Device } from 'src/_interfaces/device';
import { CentralApiService } from '../../_services/central-api.service';

@Component({
  selector: 'app-home-devices',
  templateUrl: './home-devices.component.html',
  styleUrls: ['./home-devices.component.css']
})
export class HomeDevicesComponent implements OnInit {
  devices!: Array < Device >;
  errorMessage: string | undefined;

  constructor(
    private central: CentralApiService,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.getDevices()
  }

  getDevices() {
    let size = 5;
    this.central.getDevices().subscribe((devices) => {
      this.devices = devices.slice(0, size);
    },
    (error) => {
        if (error.status == 404) {
            this.router.navigate(['']);
        }
        this.errorMessage = error.message;
    });
  }

}