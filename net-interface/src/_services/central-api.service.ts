import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CentralApiService {

  private BASE_URL = ""
  private headers = new HttpHeaders().set("Accept", "application/jwt").set('Content-Type', 'text/plain; charset=utf-8');
  private httpOptions: object = {
      headers: this.headers,
      responseType: 'text'
  }
getImageData: any;

  constructor(private httpClient: HttpClient) {
  }

}
