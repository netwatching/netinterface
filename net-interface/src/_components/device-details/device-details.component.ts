import { Component, OnInit } from '@angular/core';
import {
  Device
} from '../../_interfaces/device';
import {
  ActivatedRoute,
  Router
} from '@angular/router';
import {
  Feature
} from '../../_interfaces/feature';
import {
  CentralApiService
} from '../../_services/central-api.service';
import {
  Observable
} from 'rxjs';
import {
  Event
} from 'src/_interfaces/event';
import {
  NetworkInterface
} from 'src/_interfaces/network-interface';
import {
  EventData
} from 'src/_interfaces/event-data';
import {
  PageEvent
} from '@angular/material/paginator';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup
} from '@angular/forms';
import {
  faPlus,
  faTrash,
  faPen
} from '@fortawesome/free-solid-svg-icons';
import {
  Module
} from 'src/_interfaces/module';
import {
  Configs
} from 'src/_interfaces/configs';
import {
  angularMaterialRenderers, VerticalLayoutRenderer
} from '@jsonforms/angular-material';
import { and, createAjv, generateJsonSchema, HorizontalLayout, isControl, JsonFormsRendererRegistryEntry, JsonSchema, optionIs, rankWith, schemaTypeIs, scopeEndsWith, Tester, UISchemaElement, VerticalLayout } from '@jsonforms/core';
import { Generate } from '@jsonforms/core';


@Component({
  selector: 'app-device-details',
  templateUrl: './device-details.component.html',
  styleUrls: ['./device-details.component.scss'],
})
export class DeviceDetailsComponent implements OnInit {

  //JSONForms

  renderers: JsonFormsRendererRegistryEntry[] = angularMaterialRenderers;
  schema: JsonSchema;
  data: object;

  device!: any;
  deviceId!: string;
  features!: Feature;
  //interfaces!: Array < NetworkInterface >;
  errorMessage: string | undefined;
  date!: Date;
  upSince!: string;
  eventData!: EventData;
  events!: Array < Event > ;
  firstCall: Boolean | undefined = false;
  pageCount: number | undefined = 1;
  totalPages: number | undefined = 0;
  alertsPerPage: number | undefined = 20;
  selectedSeverities: string | undefined;
  severityForm: FormGroup;

  module: string;
  addModuleForm: FormGroup;
  modules: Array < Module > ;
  assignedModules: Configs;
  selectedModule: string;

  static!: any;
  live!: any;
  system!: any;
  interfaces!: any;
  neighbors!: any;

  showAddModuleDialog = false;
  showAddModuleSuccessDialog = false;
  showAddModuleErrorDialog = false;
  showEditModuleDialog = false;
  showEditModuleSuccessDialog = false;
  showEditModuleErrorDialog = false;
  showDeleteModuleDialog = false;
  showDeleteModuleSuccessDialog = false;
  showDeleteModuleErrorDialog = false;

  // icons
  faTrash = faTrash;
  faPlus = faPlus;
  faPen = faPen;

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

  compareIfIndex(a, b) {
    let aIfIndex = parseInt(a.index)
    let bIfIndex = parseInt(b.index)

    if (aIfIndex < bIfIndex) {
      return -1;
    }
    if (aIfIndex > bIfIndex) {
      return 1;
    }
    return 0;
  }

  ngOnInit() {
    this.getDevice()
    this.getEvents(1, this.alertsPerPage);
    this.getModules();
    this.getAssignedModules();
    this.firstCall = true;
  }

  refreshData() {
    this.getDevice()
    this.getEvents(1, this.alertsPerPage);
    this.getModules();
    this.getAssignedModules();
    this.firstCall = true;
  }

  uploadJSONFormData() {
    console.log(this.data);
  }

  getConfigSchema(moduleType){
    this.central.getModulesAssignedToDevice(this.deviceId).subscribe((data) => {
      var render_data = {};
      var schema = {};
      console.log(data.configs);
      data.configs.forEach(function(config){
        if(config.name==moduleType){
          render_data = config.type.config;
          schema = config.type.signature;
        }
      });
      this.schema = JSON.parse(schema.toString().replace(/'/g, '"'));
      this.data = JSON.parse(render_data.toString().replace(/'/g, '"'));
      this.showEditModuleDialog = true;
    },
    (error) => {
      if (error.status == 404) {
        this.router.navigate(['']);
      }
      this.errorMessage = error.message;
    }
  );
  }

  getDevice() {
    this.central.getDeviceById(this.deviceId).subscribe((device) => {
        this.device = device.device;
        this.static = this.device.static;
        this.live = this.device.live;

        for (let i = 0; i < this.static.length; i) {
          console.log(this.static[i].key)
          if (this.static[i].key == "system") {
            this.system = this.static[i].data.system;
          } else if (this.static[i].key == "network_interfaces") {
            let ints = [];
            for (let o in this.static[i].data) {
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

  getModules() {
    this.central.getModules().subscribe((moduleData) => {
        this.modules = moduleData;
      },
      (error) => {
        if (error.status == 404) {
          this.router.navigate(['']);
        }
        this.errorMessage = error.message;
      }
    );
  }

  addModule(body) {
    this.central.addModule(this.deviceId, body).then(() => {
        this.closeAddModuleDialog();
        this.openAddModuleSuccessDialog();
        this.refreshData();
      },
      err => {
        this.closeAddModuleDialog();
        this.openAddModuleErrorDialog(err.status);
      });
  }

  getAssignedModules() {
    this.central.getModulesAssignedToDevice(this.deviceId).subscribe((moduleData) => {
        this.assignedModules = moduleData;
      },
      (error) => {
        if (error.status == 404) {
          this.router.navigate(['']);
        }
        this.errorMessage = error.message;
      }
    );
  }

  unassignModuleFromDevice(moduleType) {
    this.central.deleteModuleFromDevice(this.deviceId, moduleType).then(() => {
        this.closeDeleteModuleDialog();
        this.openDeleteModuleSuccessDialog();
        this.refreshData()
      },
      err => {
        this.closeDeleteModuleDialog();
        this.openDeleteModuleErrorDialog(err.status);
      });
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
    this.selectedSeverities = selectedSeverities.substr(0, selectedSeverities.length - 1);
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
    if (this.selectedSeverities) {
      this.getEventsBySeverity(num, this.alertsPerPage, this.selectedSeverities)
    } else {
      this.getEvents(num, this.alertsPerPage)
    }
  }

  setPageCount(num: number) {
    this.pageCount += num;
    this.setPage(this.pageCount)
  }

  calcUpTime() {
    this.date = new Date();
    this.upSince = String(Date.parse(String(this.date)) - this.system.uptime)
  }

  //add module dialog

  processAddModuleFormProperties() {
    this.addModuleForm = new FormGroup({
      module: new FormControl('')
    });
  }

  openAddModuleDialog() {
    this.processAddModuleFormProperties()
    this.addModuleForm.patchValue({
      module: this.module
    })
    this.showAddModuleDialog = true;
  }

  openAddModuleSuccessDialog() {
    this.showAddModuleSuccessDialog = true;
  }

  openAddModuleErrorDialog(errorMessage) {
    this.showAddModuleErrorDialog = true;
    this.errorMessage = errorMessage;
  }

  closeAddModuleDialog() {
    this.showAddModuleDialog = false;
  }

  closeAddModuleSuccessDialog() {
    this.showAddModuleSuccessDialog = false;
  }

  closeAddModuleErrorDialog() {
    this.showAddModuleErrorDialog = false;
  }

  submitAddModuleForm() {
    const requestBody: any = {
      config: [{
        config: "",
        type: {
          id: this.addModuleForm.get('module').value
        }
      }]
    };

    this.addModule(requestBody);
    console.log(requestBody)
  }

  //edit module dialog

  openEditModuleDialog(type) {
    this.selectedModule = type;
    this.loadModuleConfig(type);
  }

  openEditModuleSuccessDialog() {
    this.showEditModuleSuccessDialog = true;
  }

  openEditModuleErrorDialog(errorMessage) {
    this.showEditModuleErrorDialog = true;
    this.errorMessage = errorMessage;
  }

  closeEditModuleDialog() {
    this.showEditModuleDialog = false;
  }

  closeEditModuleSuccessDialog() {
    this.showEditModuleSuccessDialog = false;
  }

  closeEditModuleErrorDialog() {
    this.showEditModuleErrorDialog = false;
  }

  loadModuleConfig(moduleType){
    this.getConfigSchema(moduleType);
  }

  //delete module dialog

  openDeleteModuleDialog(type) {
    this.selectedModule = type;
    this.showDeleteModuleDialog = true;
  }

  openDeleteModuleSuccessDialog() {
    this.showDeleteModuleSuccessDialog = true;
  }

  openDeleteModuleErrorDialog(errorMessage) {
    this.showDeleteModuleErrorDialog = true;
    this.errorMessage = errorMessage;
  }

  closeDeleteModuleDialog() {
    this.showDeleteModuleDialog = false;
  }

  closeDeleteModuleSuccessDialog() {
    this.showDeleteModuleSuccessDialog = false;
  }

  closeDeleteModuleErrorDialog() {
    this.showDeleteModuleErrorDialog = false;
  }

}
