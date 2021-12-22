import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
//import { Event } from 'src/_interfaces/event';
import { CentralApiService } from '../../_services/central-api.service';

@Component({
  selector: 'app-home-alerts',
  templateUrl: './home-alerts.component.html',
  styleUrls: ['./home-alerts.component.css']
})
export class HomeAlertsComponent implements OnInit {
  events!: Array < null >;
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
    this.events.push();
    this.events.push();
    this.events.push();
    this.events.push();
    this.events.push();
    this.events.push();

    /*
    this.central.getEvents().subscribe((events) => {
      this.events = events.slice(0, size);
    },
    (error) => {
        if (error.status == 404) {
            this.router.navigate(['']);
        }
        this.errorMessage = error.message;
    });
    */
  }

}
