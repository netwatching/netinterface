import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CentralApiService } from '../_services/central-api.service';
import { User } from '../_interfaces/user';
import { AuthService } from '../_services/auth.service';
import { Jwt } from '../_interfaces/jwt';
import {JwtHelperService} from '@auth0/angular-jwt';

const TOKEN_HEADER_KEY = 'Authorization';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  login_url = 'http://palguin.htl-vil.local:8081/api/login'
  refresh_url = 'http://palguin.htl-vil.local:8081/api/refresh'
  jwt!: Jwt;
  jwtHelperService!: JwtHelperService;

  isRefresh!: Boolean;

  constructor(public centralApiService: CentralApiService, public authService: AuthService) {}



  intercept(request: HttpRequest < unknown > , next: HttpHandler): Observable < HttpEvent < unknown >> {
    let auth_request = request;

    console.log(String(this.jwtHelperService.isTokenExpired(localStorage.getItem('access_token')?.toString())))
    // if (this.jwtHelperService.isTokenExpired(String(localStorage.getItem('access_token')))) {
    if (!localStorage.getItem('access_token') && !request.url.startsWith(this.login_url)) {
      const requestData: any = {};
      requestData['id'] = this.authService.user!.id
      requestData['name'] = this.authService.user!.username
      requestData['pw'] = 'TYlZfng0wwuEOaxcyyoJ2N5otTPS0g4X6fXq9s777yJxwtcpHsRQC1F5Ao5PI3MT42xlMeBOP4jN7fUAA5a5vEtM7WWIMYvQPDebr5Lcgz9Ri1yEQiwmObINIHyI8pMw'
      this.centralApiService.getJWTToken(requestData).subscribe((object) => {
        localStorage.setItem('refresh_token', object.refresh_token);
        localStorage.setItem('access_token', object.access_token);
      });
    }
    // } else {
    //   console.log("token expired")
    //   if (!request.url.startsWith(this.refresh_url)) {
    //     this.isRefresh = true
    //     this.centralApiService.getNewAccessToken().subscribe((object) => {
    //       localStorage.setItem('access_token', object.access_token);
    //     });
    //   }
    // }


    if (this.authService.authenticated) {
      if (!this.isRefresh) {
        auth_request = request.clone({
          headers: request.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + localStorage.getItem('access_token'))
        });
      } else {
        auth_request = request.clone({
          headers: request.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + localStorage.getItem('refresh_token'))
        });
      }
    }

    return next.handle(auth_request);
  }
}
