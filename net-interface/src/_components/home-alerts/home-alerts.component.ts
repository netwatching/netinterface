import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Events } from '../../_interfaces/events';
import { CentralApiService } from '../../_services/central-api.service';

@Component({
  selector: 'app-home-alerts',
  templateUrl: './home-alerts.component.html',
  styleUrls: ['./home-alerts.component.css']
})
export class HomeAlertsComponent implements OnInit {
  alerts!: Array < Events >;
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

    this.central.getEvents().subscribe((alerts) => {
      this.alerts = alerts.slice(0, size);
    },
    (error) => {
        if (error.status == 404) {
            this.router.navigate(['']);
        }
        this.errorMessage = error.message;
    });
  }

}
