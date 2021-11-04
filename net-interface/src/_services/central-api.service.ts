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

  private BASE_URL = 'palguin.htl-vil.local:8081/api/devices'
  // private headers = new HttpHeaders().set("Accept", "application/jwt").set('Content-Type', 'text/plain; charset=utf-8');
  private httpOptions: object = {
      // headers: this.headers,
      responseType: 'text'
  }
getImageData: any;

  constructor(private httpClient: HttpClient) {
  }

  public getDevices(): Observable<Array<Device>> {
    return this.httpClient
        .get<Array<Device>>(`${this.BASE_URL}/devices/`).pipe(
            retry(3)
        );
  }
}
