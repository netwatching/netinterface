import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CentralApiService } from 'src/_services/central-api.service';
import { Event } from 'src/_interfaces/event';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { debug } from 'console';
import { EventData } from 'src/_interfaces/event-data';
import {PageEvent} from '@angular/material/paginator';


@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {

  firstCall: Boolean | undefined = false;
  eventData!: EventData;
  events!: Array < Event > ;
  errorMessage: string | undefined;
  severityForm: FormGroup;

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

  pageCount: number | undefined = 1;
  totalPages: number | undefined = 0;
  alertsPerPage: number | undefined = 20;
  selectedSeverities: string | undefined;

  constructor(
    private actRoute: ActivatedRoute,
    private central: CentralApiService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.severityForm = this.formBuilder.group({
      checkArray: this.formBuilder.array([])
    })
  }

  ngOnInit() {
    this.getEvents(1, this.alertsPerPage);
    this.firstCall = true;
  }

  getEvents(page: number, amount: number) {
    this.central.getEvents(page, amount).subscribe((eventData) => {
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

  getEventsBySeverity(page: number, amount: number, severity: string) {
    this.central.getEventsBySeverity(page, amount, severity).subscribe((eventData) => {
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

}
