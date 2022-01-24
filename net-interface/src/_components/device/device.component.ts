import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
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

  categories!: Array < Category >;

  pageCount: number | undefined = 1;
  totalPages: number | undefined = 0;
  devicesPerPage: number | undefined = 18;
  selectedCategories: string | undefined;

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

  submitForm() {
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

}
