import { Component, OnInit } from '@angular/core';
import { Device } from '../../_interfaces/device';
import { ActivatedRoute, Router } from '@angular/router';
import { Feature } from '../../_interfaces/feature';
import { CentralApiService } from '../../_services/central-api.service';
import { Observable } from 'rxjs';
import { EventData } from 'src/_interfaces/event-data';
import { Event } from 'src/_interfaces/event';


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
  date!: Date;
  upSince!: string;
  eventData!: EventData;
  events!: Array < Event >;
  alertsPerPage: number | undefined = 20;


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
    this.getEvents(0, 0)
  }

  getDevice() {
    this.central.getDeviceById(this.deviceId).subscribe((device) => {
            this.device = device;
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
    this.central.getFeaturesByDevice(this.deviceId).subscribe((features) => {
      this.features = features;
      this.calcUpTime()
      },
      (error) => {
        if (error.status == 404) {
          this.router.navigate(['']);
        }
        this.errorMessage = error.message;
      }
    );
  }

  getEvents(page: number, amount: number) {
    this.central.getEventsByDevice(page, amount, this.deviceId).subscribe((eventData) => {
        this.eventData = eventData;
        this.events = eventData.alerts;
        console.log(this.events)
        // if (this.firstCall == true) {
        //   this.calcPageAmount(this.alertsPerPage)
        //   this.firstCall = false;
        // }
      },
      (error) => {
        if (error.status == 404) {
          this.router.navigate(['']);
        }
        this.errorMessage = error.message;
      }
    );
  }

  getEventsBySeverity(page: number, amount: number, severity: string) {
    this.central.getEventsBySeverityByDevice(page, amount, severity, this.deviceId).subscribe((eventData) => {
        this.eventData = eventData;
        this.events = eventData.alerts;
        // this.calcPageAmount(this.alertsPerPage)
      },
      (error) => {
        if (error.status == 404) {
          this.router.navigate(['']);
        }
        this.errorMessage = error.message;
      }
    );
  }

  calcUpTime(){
    this.date=new Date();
    this.upSince = String(Date.parse(String(this.date)) - this.features.system.uptime)
  }
}
