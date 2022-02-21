
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { retry } from 'rxjs/operators';
import { Device } from '../_interfaces/device';
import { Feature } from '../_interfaces/feature';
import { Jwt } from '../_interfaces/jwt';
import { Event } from '../_interfaces/event';
import { EventData } from '../_interfaces/event-data';
import { DeviceData } from 'src/_interfaces/device-data';
import { Category } from 'src/_interfaces/category';


@Injectable({
  providedIn: 'root'
})
export class CentralApiService {

  // private BASE_URL = 'http://palguin.htl-vil.local:8080/api'
  private BASE_URL = 'https://palguin.htl-vil.local:8443/api'
  private headers = new HttpHeaders().set("Accept", "application/j").set('Content-Type', 'text/plain; charset=utf-8');
  private httpOptions: object = {
    headers: this.headers,
    responseType: 'text'
  }

  constructor(private httpClient: HttpClient) {}

  public getDevices(page: number, amount: number): Observable < DeviceData > {
    return this.httpClient
      .get < DeviceData > (`${this.BASE_URL}/devices/?page=${page}&amount=${amount}`).pipe(
        retry(3)
      );
  }

  public getDevicesByCategory(page: number, amount: number, category: string): Observable < DeviceData > {
    return this.httpClient
      .get < DeviceData > (`${this.BASE_URL}/devices/?page=${page}&amount=${amount}&category=${category}`).pipe(
        retry(3)
      );
  }

  public getAllDevices(): Observable < DeviceData > {
    return this.httpClient
      .get < DeviceData > (`${this.BASE_URL}/devices`).pipe(
        retry(3)
      );
  }

  public async addDevice(body: object): Promise<object> {
    return await this.httpClient
        .post<object>(`${this.BASE_URL}/devices`, body).pipe(
            retry(5)
        ).toPromise();
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

  public getEventsByDevice(page: number, amount: number, deviceId: string): Observable < EventData > {
    return this.httpClient
      .get < EventData > (`${this.BASE_URL}/devices/${deviceId}/alerts/?page=${page}&amount=${amount}`).pipe(
        retry(1)
      );
  }

  public getEventsBySeverityByDevice(page: number, amount: number, severity: string, deviceId: string): Observable < EventData > {
    return this.httpClient
      .get < EventData > (`${this.BASE_URL}/devices/${deviceId}/alerts/?page=${page}&amount=${amount}&severity=${severity}`).pipe(
        retry(1)
      );
  }

  public getEvents(page: number, amount: number): Observable < EventData > {
    return this.httpClient
      .get < EventData > (`${this.BASE_URL}/alerts/?page=${page}&amount=${amount}`).pipe(
        retry(1)
      );
  }

  public getAllEvents(): Observable < EventData > {
    return this.httpClient
      .get < EventData > (`${this.BASE_URL}/alerts`).pipe(
        retry(1)
      );
  }

  public getEventsBySeverity(page: number, amount: number, severity: string): Observable < EventData > {
    return this.httpClient
      .get < EventData > (`${this.BASE_URL}/alerts/?page=${page}&amount=${amount}&severity=${severity}`).pipe(
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

  public getCategories(): Observable<Array<Category>> {
    return this.httpClient
      .get <Array<Category>> (`${this.BASE_URL}/categories`).pipe(
        retry(3)
      );
  }

  public async addCategory(body: object): Promise<object> {
    return await this.httpClient
        .post<object>(`${this.BASE_URL}/categories`, body).pipe(
            retry(5)
        ).toPromise();
  }
  
}