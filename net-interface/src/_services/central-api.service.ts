import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { retry } from 'rxjs/operators';
import { Device } from '../_interfaces/device';
import { Feature } from '../_interfaces/feature';
import { Jwt } from '../_interfaces/jwt';
import { Event } from 'src/_interfaces/event';

@Injectable({
  providedIn: 'root'
})
export class CentralApiService {

  private BASE_URL = 'http://palguin.htl-vil.local:8080/api'
  // private BASE_URL = 'https://palguin.htl-vil.local:8443/api'
  private headers = new HttpHeaders().set("Accept", "application/j").set('Content-Type', 'text/plain; charset=utf-8');
  private httpOptions: object = {
    headers: this.headers,
    responseType: 'text'
  }

  constructor(private httpClient: HttpClient) {}

  public getDevices(): Observable < Array < Device >> {
    return this.httpClient
      .get < Array < Device >> (`${this.BASE_URL}/devices`).pipe(
        retry(3)
      );
  }

  public getDeviceById(deviceId: string): Observable < Device > {
    return this.httpClient
      .get < Device > (`${this.BASE_URL}/devices/${deviceId}`).pipe(
        retry(3)
      );
  }

  public getFeaturesByDevice(deviceId: string): Observable < Feature > {
    return this.httpClient
      .get < Feature > (`${this.BASE_URL}/devices/${deviceId}/features`).pipe(
        retry(1)
      );
  }

  public getEvents(): Observable < Array < Event >> {
    return this.httpClient
      .get < Array < Event >> (`${this.BASE_URL}/alerts`).pipe(
        retry(1)
      );
  }

  public getEventsById(eventId: string): Observable < Event > {
    return this.httpClient
      .get < Event > (`${this.BASE_URL}/alerts/${eventId}/`).pipe(
        retry(1)
      );
  }

  public getEventsByMinSeverity(minSeverity: string): Observable < Array < Event >> {
    return this.httpClient
      .get < Array < Event >> (`${this.BASE_URL}/alerts/?minSeverity=${minSeverity}`).pipe(
        retry(1)
      );
  }

  public getJWTToken(body: object): Observable < Jwt > {
    return this.httpClient
      .post < Jwt > (`${this.BASE_URL}/login`, body).pipe(
        retry(1)
      );
  }

  public getNewAccessToken(): Observable < Jwt > {
    return this.httpClient
      .post < Jwt > (`${this.BASE_URL}/request`, "").pipe(
        retry(1)
      );
  }
}
