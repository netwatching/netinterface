import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DeviceAndAppManagementRoleAssignment } from '@microsoft/microsoft-graph-types';
import { Device } from 'src/_interfaces/device';
import { DeviceData } from 'src/_interfaces/device-data';
import { CentralApiService } from '../../_services/central-api.service';
import { Category } from 'src/_interfaces/category';

@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.scss']
})
export class DeviceComponent implements OnInit {

  firstCall: Boolean | undefined = false;
  devices!: Array < Device > ;
  deviceData!: DeviceData;
  errorMessage: string | undefined;
  categoryForm: FormGroup;

  categories!: Array < Category > ;

  pageCount: number | undefined = 1;
  totalPages: number | undefined = 0;
  devicesPerPage: number | undefined = 18;
  selectedCategories: string | undefined;

  showAddDeviceDialog = false;

  addDeviceForm: FormGroup;
  addDeviceDialogIsOpened = false;
  showAddDeviceSuccessDialog = false;
  showAddDeviceErrorDialog = false;
  device: string;
  category: string;
  ip: string;

  constructor(
    private central: CentralApiService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.categoryForm = this.formBuilder.group({
      checkArray: this.formBuilder.array([])
    })
  }

  ngOnInit() {
    this.getCategories();
    this.getDevices(1, this.devicesPerPage);
    this.firstCall = true;
  }

  getDevices(page: number, amount: number) {
    this.central.getDevices(page, amount).subscribe((deviceData) => {
        this.deviceData = deviceData;
        this.devices = deviceData.devices;
        if (this.firstCall == true) {
          this.calcPageAmount(this.devicesPerPage)
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

  getDevicesByCategory(page: number, amount: number, category: string) {
    this.central.getDevicesByCategory(page, amount, category).subscribe((deviceData) => {
        this.deviceData = deviceData;
        this.devices = deviceData.devices;
        this.calcPageAmount(this.devicesPerPage)
      },
      (error) => {
        if (error.status == 404) {
          this.router.navigate(['']);
        }
        this.errorMessage = error.message;
      }
    );
  }

  getCategories() {
    this.central.getCategories().subscribe((categories) => {
        this.categories = categories;
      },
      (error) => {
        if (error.status == 404) {
          this.router.navigate(['']);
        }
        this.errorMessage = error.message;
      }
    );
  }

  submitFilterForm() {
    let selectedCategories: string = "";
    this.categoryForm.value["checkArray"].forEach(function (value) {
      selectedCategories += value + "_";
    });
    this.selectedCategories = selectedCategories.substr(0, selectedCategories.length - 1);
    this.getDevicesByCategory(1, this.devicesPerPage, this.selectedCategories)
  }

  onCheckboxChange(e) {
    const checkArray: FormArray = this.categoryForm.get('checkArray') as FormArray;
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

  calcPageAmount(devicesPerPage: number) {
    this.totalPages = Math.round(this.deviceData.total / devicesPerPage);
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
    if (this.selectedCategories) {
      this.getDevicesByCategory(num, this.devicesPerPage, this.selectedCategories)
    } else {
      this.getDevices(num, this.devicesPerPage)
    }
  }

  setPageCount(num: number) {
    this.pageCount += num;
    this.setPage(this.pageCount)
  }



  // closeAddDeviceDialog() {
  //   this.addDeviceDialogIsOpened = false;
  // }

  // openAddDeviceSuccessDialog() {
  //   this.showAddDeviceSuccessDialog = true;
  // }

  // closeAddDeviceSuccessDialog() {
  //   window.location.reload();
  //   this.showAddDeviceSuccessDialog = false;
  // }

  // openAddDeviceErrorDialog(errorMessage) {
  //   this.showAddDeviceErrorDialog = true;
  //   this.errorMessage = errorMessage;
  // }

  // closeAddDeviceErrorDialog() {
  //   window.location.reload();
  //   this.showAddDeviceErrorDialog = false;
  // }



  // onAddDeviceFormSubmit() {
  //   if (this.addDeviceForm.valid) {
  //     const requestBody: any = {};
  //     requestBody['device'] = this.addDeviceForm.get('name').value;
  //     requestBody['category'] = this.addDeviceForm.get('categoty').value;
  //     requestBody['ip'] = this.addDeviceForm.get('ip').value;

  //     //request here
  //   }
  //   for (const name in this.addDeviceForm.controls) {
  //     if (document.getElementById(name)) {
  //       const element = document.getElementById(name);
  //       if (this.addDeviceForm.controls[name].invalid) {
  //         element.style.borderColor = 'red';
  //       } else {
  //         element.style.borderColor = '#ced4da';
  //       }
  //     }
  //   }
  // }

  processAddDeviceFormProperties() {
    this.addDeviceForm = new FormGroup({
      device: new FormControl(''),
      ip: new FormControl(''),
      category: new FormControl(''),
    });
  }

  openAddDeviceDialog() {
    this.processAddDeviceFormProperties()
    this.addDeviceForm.patchValue({
      device: this.device,
      ip: this.ip,
      category: this.category,
    })
    this.showAddDeviceDialog = true;
  }

  closeAddDeviceDialog() {
    this.showAddDeviceDialog = false;
  }

  submitAddDeviceForm(){
    const requestBody: any = {};
    requestBody['device'] = this.addDeviceForm.get('device').value;
    requestBody['ip'] = this.addDeviceForm.get('ip').value;
    requestBody['category'] = this.addDeviceForm.get('category').value;
    console.log(requestBody)
    this.central.addDevice(requestBody);
  }

}
