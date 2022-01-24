import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Device } from 'src/_interfaces/device';
import { CentralApiService } from '../../_services/central-api.service';


@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.scss']
})
export class DeviceComponent implements OnInit {

  devices!: Array < Device >;
  errorMessage: string | undefined;
  categoryForm: FormGroup;

  categories: Array<any> = ['external','testing'];

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
    this.getDevices()
  }

  getDevices() {
    this.central.getAllDevices().subscribe((devices) => {
            this.devices = devices.devices;
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
    console.log(this.categoryForm.value)
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

}
