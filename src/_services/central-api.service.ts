import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
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
import { Module } from 'src/_interfaces/module';
import { Configs } from 'src/_interfaces/configs';


@Injectable({
  providedIn: 'root'
})
export class CentralApiService {

  helper = new JwtHelperService();

  private BASE_URL = 'https://palguin.htl-vil.local:8443/api';
  private headers = new HttpHeaders().set("Accept", "application/json").set('Content-Type', 'application/json; charset=utf-8').set("Authorization", "Bearer " + localStorage.getItem('access_token'));
  private httpOptions: object = {
    headers: this.headers,
    responseType: 'json'
  }

  constructor(private httpClient: HttpClient, private httpBackend: HttpBackend) {}

  private jwtHandler(){
    if (this.helper.isTokenExpired(localStorage.getItem('access_token')?.toString())){
      const requestData: any = {};
      requestData['pw'] = environment.apiKey;
      this.getJWTToken(requestData).subscribe((object) => {
      localStorage.setItem('access_token', object.access_token);
      this.headers.set("Authorization", "Bearer " + object.access_token);
      })
    }
  }

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

  public async addDevice(body: object): Promise < object > {
    return await this.httpClient
      .post < object > (`${this.BASE_URL}/devices`, body).pipe(
        retry(5)
      ).toPromise();
  }

  public getDeviceById(deviceId: string): Observable < any > {
    return this.httpClient
      .get < Device > (`${this.BASE_URL}/devices/${deviceId}`).pipe(
        retry(3)
      );
  }

  public async deleteDeviceById(deviceId: string) {
    return await this.httpClient
      .delete(`${this.BASE_URL}/devices/${deviceId}`).pipe(
        retry(3)
      ).toPromise();
  }

  public async deleteCategoryById(categoryId: string) {
    return await this.httpClient
      .delete(`${this.BASE_URL}/categories/${categoryId}`).pipe(
        retry(1)
      ).toPromise();
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

  public getCategories(): Observable < any > {
    return this.httpClient
      .get < any > (`${this.BASE_URL}/categories`).pipe(
        retry(3)
      );
  }

  public getModules(): Observable < Array < Module >> {
    return this.httpClient
      .get <Array< Module >> (`${this.BASE_URL}/modules`).pipe(
        retry(3)
      );
  }

  public getModulesAssignedToDevice(deviceId): Observable < Configs > {
    return this.httpClient
      .get < Configs > (`${this.BASE_URL}/devices/${deviceId}/config`).pipe(
        retry(3)
      );
  }

  public async addModule(deviceId,  body: object): Promise < object > {
    return await this.httpClient
      .post < object > (`${this.BASE_URL}/devices/${deviceId}/config`, body).pipe().toPromise();
  }

  public async deleteModuleFromDevice(deviceId, moduleId): Promise < object > {
    return await this.httpClient
      .delete < object > (`${this.BASE_URL}/devices/${deviceId}/module/${moduleId}`).pipe().toPromise();
  }

  public async addCategory(body: object): Promise < object > {
    return await this.httpClient
      .post < object > (`${this.BASE_URL}/categories`, body).pipe(
        retry(5)
      ).toPromise();
  }

  public getTree(): Observable < Tree > {
    return this.httpClient
      .get < Tree > (`${this.BASE_URL}/tree`).pipe(
        retry(3)
      );
  }

  public getTreeByVLAN(vlan: number): Observable < Tree > {
    return this.httpClient
      .get < Tree > (`${this.BASE_URL}/tree?vlan_id=${vlan}`).pipe(
        retry(3)
      );
  }

  public getJWTToken(body: object): Observable < Jwt > {
    var accessHeaders = new HttpHeaders().set("Accept", "application/json").set('Content-Type', 'application/json; charset=utf-8');
    var accessHttpOptions: object = {
      headers: accessHeaders,
      responseType: 'json'
    };
    var localClient = new HttpClient(this.httpBackend)
    return localClient
      .post < Jwt > (`${this.BASE_URL}/login`, body, accessHttpOptions).pipe(
        retry(1)
      );
  }

  public getNewAccessToken(): Observable < Jwt > {
    return this.httpClient
      .post < Jwt > (`${this.BASE_URL}/request`, "").pipe(
        retry(1)
      );
  }

  public refreshToken(): Observable <any> {
    var refreshHeaders = new HttpHeaders().set("Accept", "application/json").set('Content-Type', 'application/json; charset=utf-8').set("Authorization", "Bearer " + localStorage.getItem('refresh_token'));
    var refreshHttpOptions: object = {
      headers: refreshHeaders,
      responseType: 'json'
    };
    var localClient = new HttpClient(this.httpBackend)
    return localClient
    .post < Jwt > (`${this.BASE_URL}/refresh`, "", refreshHttpOptions).pipe(
     retry(1)
    );
  }

}
