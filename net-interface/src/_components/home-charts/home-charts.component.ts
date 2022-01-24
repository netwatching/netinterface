import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Event } from '../../_interfaces/event';
import { EventData } from '../../_interfaces/event-data';
import { Device } from '../../_interfaces/device';
import { CentralApiService } from '../../_services/central-api.service';
import LinearGradient from 'zrender/lib/graphic/LinearGradient';

@Component({
  selector: 'app-home-charts',
  templateUrl: './home-charts.component.html',
  styleUrls: ['./home-charts.component.css']
})
export class HomeChartsComponent implements OnInit {
  errorMessage: string | undefined;
  categoryChart: any;
  eventsChart: any;

  constructor(
    private central: CentralApiService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const xAxisDataDeviceCateories = [];
    const dataDeviceCategories = []
    const xAxisDataEventSeverities = [];
    const data = [];

    this.central.getDevices().subscribe((devices) => {
      let countsCategories = {};
      let categories = []
      for (let d of devices){
        categories.push(d.category)
      }
      categories.forEach(function(x) { countsCategories[x] = (countsCategories[x] || 0)+1; });

      for (let x in countsCategories){
        xAxisDataDeviceCateories.push(x)
      }
      for (let y in xAxisDataDeviceCateories){
        dataDeviceCategories.push({value: countsCategories[xAxisDataDeviceCateories[y]], name: xAxisDataDeviceCateories[y]})
      }

      this.categoryChart = {
        title: {
          text: 'Device Categories',
          subtext: 'Number of devices per category',
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '<b>{b}</b><br/># of devices: {c} ({d}%)'
        },
        legend: {
          x: 'center',
          y: 'bottom',
          data: xAxisDataDeviceCateories
        },
        calculable: true,
        series: [
          {
            name: 'area',
            type: 'pie',
            radius: [20, 100],
            roseType: 'area',
            data: dataDeviceCategories
          }
        ]
      };
    },
    (error) => {
        if (error.status == 404) {
            this.router.navigate(['']);
        }
        this.errorMessage = error.message;
    });

    this.central.getAllEvents().subscribe((alertData) => {
      let countsSeverities = {};
      let severities = []
      let alerts = alertData.alerts;
      for (let a of alerts){
        severities.push(a.severity)
      }
      severities.forEach(function(x) { countsSeverities[x] = (countsSeverities[x] || 0)+1; });

      for (let x in countsSeverities){
        xAxisDataEventSeverities.push(x)
        data.push(countsSeverities[x])
      }

      const yMax = data.reduce((prev, current) => (prev.y > current.y) ? prev : current) + 10;
      const dataShadow = [];
      for (let i = 0; i < xAxisDataEventSeverities.length; i++) {
        dataShadow.push(yMax);
      }

      this.eventsChart = {
        title: {
          text: 'Events Severity',
          subtext: 'Number of events per severity',
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '<b>Severity: {b}</b><br/># of events: {c}'
        },
        xAxis: {
          data: xAxisDataEventSeverities,
          axisLabel: {
            inside: true,
            color: '#fff',
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          z: 10,
        },
        yAxis: {
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            textStyle: {
              color: '#999',
            },
          },
        },
        series: [
          {
            type: 'bar',
            itemStyle: {
              color: new LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#83bff6' },
                { offset: 0.5, color: '#188df0' },
                { offset: 1, color: '#188df0' },
              ]),
            },
            emphasis: {
              itemStyle: {
                color: new LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#2378f7' },
                  { offset: 0.7, color: '#2378f7' },
                  { offset: 1, color: '#83bff6' },
                ]),
              }
            },
            data,
          },
        ],

      };
    },
    (error) => {
        if (error.status == 404) {
            this.router.navigate(['']);
        }
        this.errorMessage = error.message;
    });
  }

  onChartEvent(event: any, type: string) {
    console.log('chart event:', type, event);
  }
}
