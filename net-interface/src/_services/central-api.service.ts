import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { retry } from 'rxjs/operators';
import { Device } from '../_interfaces/device';

@Injectable({
  providedIn: 'root'
})
export class CentralApiService {

  private BASE_URL = 'http://palguin.htl-vil.local:8081/api'
  // private headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
  private headers = new HttpHeaders().set("Accept", "application/json").set('Content-Type', 'application/json; charset=utf-8');
  // private headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
  private httpOptions: object = {
      headers: this.headers,
      responseType: 'text'
  }

  constructor(private httpClient: HttpClient) {
  }

  public async getJWTToken(body: object): Promise<object> {
    return await this.httpClient
        .post<object>(`${this.BASE_URL}/login`, body).pipe(
            retry(1)
        ).toPromise();
    }

  public getDevices(): Observable<Array<Device>> {
    return this.httpClient
        .get<Array<Device>>(`${this.BASE_URL}/devices`).pipe(
            retry(3)
        );
  }
}
