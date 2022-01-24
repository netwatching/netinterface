import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Event } from '../../_interfaces/event';
import { EventData } from '../../_interfaces/event-data';
import { CentralApiService } from '../../_services/central-api.service';

@Component({
  selector: 'app-home-alerts',
  templateUrl: './home-alerts.component.html',
  styleUrls: ['./home-alerts.component.css']
})

export class HomeAlertsComponent implements OnInit {
  alerts!: Array < Event >;
  alertData!: EventData;
  errorMessage: string | undefined;

  constructor(
    private central: CentralApiService,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.getEvents()
  }

  getEvents() {
    let size = 5;

    this.central.getEvents(1, size).subscribe((alertData) => {
      this.alerts = alertData.alerts;
      console.log(this.alerts)
    },
    (error) => {
        if (error.status == 404) {
            this.router.navigate(['']);
        }
        this.errorMessage = error.message;
    });
  }

}
