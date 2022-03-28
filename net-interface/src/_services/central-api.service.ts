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
import { Tree } from 'src/_interfaces/tree';
import { JwtHelperService } from "@auth0/angular-jwt";

@Injectable({
  providedIn: 'root'
})
export class CentralApiService {

  helper = new JwtHelperService();
  
  private BASE_URL = 'https://palguin.htl-vil.local:8443/api';
  private headers = new HttpHeaders().set("Accept", "application/json").set('Content-Type', 'text/plain; charset=utf-8').set("Authorization", "Bearer " + sessionStorage.getItem('access_token').toString());
  private httpOptions: object = {
    headers: this.headers,
    responseType: 'text'
  }

  constructor(private httpClient: HttpClient) {}

  private jwtHandler(){
    if (this.helper.isTokenExpired(sessionStorage.getItem('access_token')?.toString()) || !sessionStorage.getItem('access_token').toString()){
      const requestData: any = {};
      requestData['pw'] = environment.apiKey;
      this.getJWTToken(requestData).subscribe((object) => {
      sessionStorage.setItem('access_token', object.access_token);
      // this.headers.set("Authorization", "Bearer " + object.access_token);
      })
    }
  }

  public getDevices(page: number, amount: number): Observable < DeviceData > {
    this.jwtHandler()
    return this.httpClient
      .get < DeviceData > (`${this.BASE_URL}/devices/?page=${page}&amount=${amount}`, this.httpOptions).pipe(
        retry(3)
      );
  }

  public getDevicesByCategory(page: number, amount: number, category: string): Observable < DeviceData > {
    this.jwtHandler()
    return this.httpClient
      .get < DeviceData > (`${this.BASE_URL}/devices/?page=${page}&amount=${amount}&category=${category}`, this.httpOptions).pipe(
        retry(3)
      );
  }

  public getAllDevices(): Observable < DeviceData > {
    this.jwtHandler()
    return this.httpClient
      .get < DeviceData > (`${this.BASE_URL}/devices`, this.httpOptions).pipe(
        retry(3)
      );
  }

  public async addDevice(body: object): Promise < object > {
    this.jwtHandler()
    return await this.httpClient
      .post < object > (`${this.BASE_URL}/devices`, this.httpOptions, body).pipe(
        retry(5)
      ).toPromise();
  }

  public getDeviceById(deviceId: string): Observable < any > {
    this.jwtHandler()
    return this.httpClient
      .get < Device > (`${this.BASE_URL}/devices/${deviceId}`, this.httpOptions).pipe(
        retry(3)
      );
  }

  public async deleteDeviceById(deviceId: string) {
    this.jwtHandler()
    return await this.httpClient
      .delete(`${this.BASE_URL}/devices/${deviceId}`, this.httpOptions).pipe(
        retry(3)
      ).toPromise();
  }

  public async deleteCategoryById(categoryId: string) {
    this.jwtHandler()
    return await this.httpClient
      .delete(`${this.BASE_URL}/catrgory/${categoryId}`, this.httpOptions).pipe(
        retry(1)
      ).toPromise();
  }

  public getFeaturesByDevice(deviceId: string): Observable < Feature > {
    this.jwtHandler()
    return this.httpClient
      .get < Feature > (`${this.BASE_URL}/devices/${deviceId}/features`, this.httpOptions).pipe(
        retry(1)
      );
  }

  public getEventsByDevice(page: number, amount: number, deviceId: string): Observable < EventData > {
    this.jwtHandler()
    return this.httpClient
      .get < EventData > (`${this.BASE_URL}/devices/${deviceId}/alerts/?page=${page}&amount=${amount}`, this.httpOptions).pipe(
        retry(1)
      );
  }

  public getEventsBySeverityByDevice(page: number, amount: number, severity: string, deviceId: string): Observable < EventData > {
    this.jwtHandler()
    return this.httpClient
      .get < EventData > (`${this.BASE_URL}/devices/${deviceId}/alerts/?page=${page}&amount=${amount}&severity=${severity}`, this.httpOptions).pipe(
        retry(1)
      );
  }

  public getEvents(page: number, amount: number): Observable < EventData > {
    this.jwtHandler()
    return this.httpClient
      .get < EventData > (`${this.BASE_URL}/alerts/?page=${page}&amount=${amount}`, this.httpOptions).pipe(
        retry(1)
      );
  }

  public getAllEvents(): Observable < EventData > {
    this.jwtHandler()
    return this.httpClient
      .get < EventData > (`${this.BASE_URL}/alerts`, this.httpOptions).pipe(
        retry(1)
      );
  }

  public getEventsBySeverity(page: number, amount: number, severity: string): Observable < EventData > {
    this.jwtHandler()
    return this.httpClient
      .get < EventData > (`${this.BASE_URL}/alerts/?page=${page}&amount=${amount}&severity=${severity}`, this.httpOptions).pipe(
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

  public getCategories(): Observable < Array < Category >> {
    this.jwtHandler()
    return this.httpClient
      .get < Array < Category >> (`${this.BASE_URL}/categories`, this.httpOptions).pipe(
        retry(3)
      );
  }

  public async addCategory(body: object): Promise < object > {
    this.jwtHandler()
    return await this.httpClient
      .post < object > (`${this.BASE_URL}/categories`, this.httpOptions, body).pipe(
        retry(5)
      ).toPromise();
  }

  public getTree(): Observable < Tree > {
    this.jwtHandler()
    return this.httpClient
      .get < Tree > (`${this.BASE_URL}/tree`, this.httpOptions).pipe(
        retry(3)
      );
  }

}
