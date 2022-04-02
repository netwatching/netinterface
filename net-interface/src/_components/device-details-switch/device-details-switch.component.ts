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
  device!: any;
  deviceId!: string;
  errorMessage: string | undefined;
  switch!: Array < Switch >;
  static!: any;
  interfaces!: any;

  showSwInterfaceModal: boolean = false;
  swInterfaceModalData!:  any;

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
    this.getDevice();
  }

  swPortClicked(portIndex:number){
    console.log('Port ' + portIndex.toString() + ' clicked!')
    this.getInterfaceByIndex(portIndex);
    this.showSwInterfaceModal = true;
  }

  closeModal(){
    this.showSwInterfaceModal = false;
  }

  getTooltip(port:number){
    let out = '';
    for (let i of this.interfaces){
      if (i.index === port){
        out = "<b>Interface:</b> " + i.index + "</br><b>Description:</b> " + i.description + "</br><b>Type:</b> " + i.type + "</br><b>Admin status:</b> " + i.admin_status + "</br><b>Operating status:</b> " + i.operating_status;
      }
    }
    return out;
  }


  getInterfaceByIndex(portIndex:number){
    for (let i of this.interfaces){
      if (i.index === portIndex){
        this.swInterfaceModalData = i;
        console.log(i);
      }
    }
  }

  getDevice() {
    this.central.getDeviceById(this.deviceId).subscribe((device) => {
      this.device = device.device;
      this.static = this.device.static;

      for (let i = 0; i < this.static.length; i) {
        if (this.static[i].key == "network_interfaces") {
          let ints = [];
          for (let o in this.static[i].data) {
            ints.push(this.static[i].data[o]);
          }
          this.interfaces = ints;
        }
        i++;
      }
      this.interfaces = this.interfaces.sort(this.compareIfIndex);

      console.log('log interfaces after sorting');
      console.log(this.interfaces);
      console.log('---------------');

      let sw: Switch[] = [];
      if (this.interfaces.length > 12){
        let int1 = null;
        let c = 0;
        for (let i of this.interfaces){
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

        if (this.interfaces.length % 2 == 1){
          let i = this.interfaces[this.interfaces.length - 1]
          if (i.type != 'ieee8023adLag'){
            sw.push({
              isTwoPort: false,
              int1: i,
              int2: null
            });
          }
        }
      } else {
        for (let i of this.interfaces){
          if (i.type != 'ieee8023adLag'){

            i.index = Number(i.index);
            i.speed = Number(i.speed);

            sw.push({
              isTwoPort: false,
              int1: i,
              int2: null
            });
          }
        }
      }
      this.switch = sw;
      console.log('log switch after creation');
      console.log(this.switch);
      console.log('---------------');
    },
    (error) => {
      if (error.status == 404) {
        this.router.navigate(['']);
      }
      this.errorMessage = error.message;
    });
  }
}
