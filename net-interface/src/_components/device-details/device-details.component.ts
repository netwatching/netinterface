import { Component, OnInit } from '@angular/core';
import { Device } from '../../_interfaces/device';
import { ActivatedRoute, Router } from '@angular/router';
import { Feature } from '../../_interfaces/feature';
import { CentralApiService } from '../../_services/central-api.service';
import { Observable } from 'rxjs';
import { Event } from 'src/_interfaces/event';
import { NetworkInterface } from 'src/_interfaces/network-interface';
import { EventData } from 'src/_interfaces/event-data';
import {PageEvent} from '@angular/material/paginator';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-device-details',
  templateUrl: './device-details.component.html',
  styleUrls: ['./device-details.component.scss']
})
export class DeviceDetailsComponent implements OnInit {

  device!: any;
  deviceId!: string;
  features!: Feature;
  //interfaces!: Array < NetworkInterface >;
  errorMessage: string | undefined;
  date!: Date;
  upSince!: string;
  eventData!: EventData;
  events!: Array < Event >;
  firstCall: Boolean | undefined = false;
  pageCount: number | undefined = 1;
  totalPages: number | undefined = 0;
  alertsPerPage: number | undefined = 20;
  selectedSeverities: string | undefined;
  severityForm: FormGroup;

  static!: any;
  live!: any;
  system!: any;
  interfaces!: any;
  neighbors!: any;

  severityRanks: Array < any > = [{
      name: 'debug',
      value: '1'
    },
    {
      name: 'information',
      value: '2'
    },
    {
      name: 'warning',
      value: '3'
    },
    {
      name: 'error',
      value: '4'
    },
    {
      name: 'disaster',
      value: '5'
    }
  ];


  constructor(
    private actRoute: ActivatedRoute,
    private central: CentralApiService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.severityForm = this.formBuilder.group({
      checkArray: this.formBuilder.array([])
    });
    this.actRoute.params.subscribe((params) => {
      this.deviceId = params.deviceId;
    });
  }

  compareIfIndex( a, b ) {
    let aIfIndex = parseInt(a.index)
    let bIfIndex = parseInt(b.index)

    if ( aIfIndex < bIfIndex ){
      return -1;
    }
    if ( aIfIndex > bIfIndex){
      return 1;
    }
    return 0;
  }

  ngOnInit() {
    this.getDevice()
    this.getEvents(1, this.alertsPerPage);
    this.firstCall = true;
  }

  getDevice() {
    this.central.getDeviceById(this.deviceId).subscribe((device) => {
            this.device = device.device;
            this.static = this.device.static;
            this.live = this.device.live;

            for (let i = 0; i < this.static.length; i){
              console.log(this.static[i].key)
              if(this.static[i].key == "system"){
                this.system = this.static[i].data.system;
              } else if (this.static[i].key == "network_interfaces") {
                let ints = [];
                for (let o in this.static[i].data){
                  ints.push(this.static[i].data[o]);
                }
                this.interfaces = ints;
              } else if (this.static[i].key == "neighbors") {
                this.neighbors = this.static[i].data;
              }
              i++;
            }

            console.log('this.device -------------->');
            console.log(this.device);
            console.log('this.static -------------->');
            console.log(this.static);
            console.log('this.live -------------->');
            console.log(this.live);
            console.log('this.system -------------->');
            console.log(this.system);
            console.log('this.network_interfaces -------------->');
            console.log(this.interfaces);
            console.log('this.neighbors -------------->');
            console.log(this.neighbors);

            this.calcUpTime();
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

        console.log(this.eventData);
        console.log(this.events);

        if (this.firstCall == true) {
          this.calcPageAmount(this.alertsPerPage)
          this.firstCall = false;
        }
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
        this.calcPageAmount(this.alertsPerPage)
      },
      (error) => {
        if (error.status == 404) {
          this.router.navigate(['']);
        }
        this.errorMessage = error.message;
      }
    );
  }

  submitForm() {
    let selectedSeverities: string = "";
    this.severityForm.value["checkArray"].forEach(function (value) {
      selectedSeverities += value + "_";
    });
    this.selectedSeverities = selectedSeverities.substr(0, selectedSeverities.length-1);
    this.getEventsBySeverity(1, this.alertsPerPage, this.selectedSeverities)
  }

  onCheckboxChange(e) {
    const checkArray: FormArray = this.severityForm.get('checkArray') as FormArray;
    if (e.target.checked) {
      checkArray.push(new FormControl(e.target.value));
    } else {
      let i: number = 0;
      checkArray.controls.forEach((item: FormControl) => {
        if (item.value == e.target.value) {
          checkArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  calcPageAmount(alertsPerPage: number) {
    this.totalPages = Math.round(this.eventData.total / alertsPerPage);
  }

  gotoPage(num: number) {
    this.setPage(num)
  }

  gotoFirstPage() {
    this.setPage(1)
  }

  gotoLastPage() {
    this.setPage(this.totalPages)
  }

  setPage(num: number) {
    this.pageCount = num;
    if(this.selectedSeverities){
      this.getEventsBySeverity(num, this.alertsPerPage, this.selectedSeverities)
    }
    else{
      this.getEvents(num, this.alertsPerPage)
    }
  }

  setPageCount(num: number) {
    this.pageCount += num;
    this.setPage(this.pageCount)
  }

  calcUpTime(){
    this.date=new Date();
    this.upSince = String(Date.parse(String(this.date)) - this.system.uptime)
  }
}
