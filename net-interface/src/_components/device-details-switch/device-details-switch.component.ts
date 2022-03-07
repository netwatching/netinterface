import { Component, OnInit } from '@angular/core';
import { Device } from '../../_interfaces/device';
import { ActivatedRoute, Router } from '@angular/router';
import { Feature } from '../../_interfaces/feature';
import { CentralApiService } from '../../_services/central-api.service';
import { Switch } from '../../_interfaces/switch';
import { NetworkInterface } from 'src/_interfaces/network-interface';

@Component({
  selector: 'app-device-details-switch',
  templateUrl: './device-details-switch.component.html',
  styleUrls: ['./device-details-switch.component.css']
})
export class DeviceDetailsSwitchComponent implements OnInit {
  device!: Device;
  deviceId!: string;
  features!: Feature;
  errorMessage: string | undefined;
  switch!: Array < Switch >;

  showSwInterfaceModal: boolean = false;
  swInterfaceModalData!:  NetworkInterface;

  constructor(
    private actRoute: ActivatedRoute,
    private central: CentralApiService,
    private router: Router,
  ) {
    this.actRoute.params.subscribe((params) => {
      this.deviceId = params.deviceId;
    });
  }

  counter(i: number) {
    return new Array(i);
  }

  compareIfIndex( a, b ) {
    let aIfIndex = parseInt(a.index);
    let bIfIndex = parseInt(b.index);

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
    this.getDeviceFeatures()
  }

  swPortClicked(portIndex:number){
    console.log('Port ' + portIndex.toString() + ' clicked!')
    this.getInterfaceByIndex(portIndex);
    this.showSwInterfaceModal = true;
  }

  closeModal(){
    this.showSwInterfaceModal = false;
  }


  getInterfaceByIndex(portIndex:number){
    for (let i of this.features.interfaces){
      if (i.index === portIndex){
        this.swInterfaceModalData = i;
        console.log(i);
      }
    }
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

      let interfaces = [];
      for (let i of this.features.interfaces){
        interfaces.push(i);
      }
      interfaces = interfaces.sort(this.compareIfIndex);

      let sw: Switch[] = [];
      if (interfaces.length > 12){
        let int1 = null;
        let c = 0;
        for (let i of interfaces){
          if (i.type != 'ieee8023adLag'){
            if (c % 2 == 0) {
              int1 = i;
            }
            if (c % 2 == 1) {
              sw.push({
                isTwoPort: true,
                int1: int1,
                int2: i
              });
              int1 = null;
            }
            c += 1;
          }
        }

        if (interfaces.length % 2 == 1){
          let i = interfaces[interfaces.length - 1]
          if (i.type != 'ieee8023adLag'){
            sw.push({
              isTwoPort: false,
              int1: i,
              int2: null
            });
          }
        }
      } else {
        for (let i of interfaces){
          if (i.type != 'ieee8023adLag'){
            sw.push({
              isTwoPort: false,
              int1: i,
              int2: null
            });
          }
        }
      }
      this.switch = sw;
    },
    (error) => {
      if (error.status == 404) {
        this.router.navigate(['']);
      }
      this.errorMessage = error.message;
    });
  }
}
