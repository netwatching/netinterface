import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CentralApiService } from 'src/_services/central-api.service';
import { Event } from 'src/_interfaces/event';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { debug } from 'console';


@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {

  events!: Array < Event > ;
  errorMessage: string | undefined;
  severityForm: FormGroup;

  severityRanks: Array<any> = ['debug','information','warning','error','disaster'];

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
    this.getEvents()
  }

  getEvents() {
    this.central.getEvents().subscribe((events) => {
        this.events = events;
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
    console.log(this.severityForm.value)
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
}
