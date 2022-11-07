import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpBackend } from '@angular/common/http';
import { throwError, Observable, BehaviorSubject, of } from "rxjs";
import { CentralApiService } from '../_services/central-api.service';
import { User } from '../_interfaces/user';
import { AuthService } from '../_services/auth.service';
import { Jwt } from '../_interfaces/jwt';
import { JwtHelperService } from "@auth0/angular-jwt";
import { environment } from '../environments/environment';
import { catchError, filter, take, switchMap, finalize } from "rxjs/operators";

const TOKEN_HEADER_KEY = 'Authorization';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(public centralApiService: CentralApiService, private httpBackend: HttpBackend) {}
    helper = new JwtHelperService();
    private refreshingToken = false;
    private accessTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

    intercept(request: HttpRequest<any>, next: HttpHandler) {
        request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
        let token: string | null = localStorage.getItem("access_token");
        var forcegenerate = false;
        try {
            //check if token is valid. If not: Force generate one using shared secret
            this.helper.isTokenExpired(token, 30);
        }
        catch(error) {
            console.log("Token not valid, generating new one!");
            forcegenerate = true;
        }
        // check if token is still valid
        if (!token || forcegenerate || this.helper.isTokenExpired(token, 30)) {
            // token expired

            // check if token already gets refreshed
            if(this.refreshingToken) {
                // token is currenty getting refreshed
                // wait until token got refreshed
                this.accessTokenSubject.pipe(
                    filter(result => result !== null),
                    take(1),
                    switchMap(() => {return next.handle(this.addTokenHeader(request))})
                );
            }
            else {
                // token is no longer valid and has to be refreshed
                this.accessTokenSubject.next(null);
                this.refreshingToken = true;
                var refresh_token: string | null = localStorage.getItem("refresh_token");
                try {
                    //check if token is valid. If not: Force generate one using shared secret
                    this.helper.isTokenExpired(refresh_token, 30);
                }
                catch(error) {
                    console.log("Token not valid, generating new one!");
                    forcegenerate = true;
                }

                //check if refresh token is still valid. If not: use shared secret
                if ( !forcegenerate && refresh_token && !this.helper.isTokenExpired(refresh_token, 30)) {
                    // use refresh_token for new tokens
                    this.centralApiService.refreshToken().subscribe((jwtData) => {
                        localStorage.setItem("access_token", jwtData["access_token"]);
                        localStorage.setItem("refresh_token", jwtData["refresh_token"]);
                        this.accessTokenSubject.next(true);
                        this.refreshingToken = false
                        return next.handle(this.addTokenHeader(request));
                    });
                }
                else {
                    // use shared secret for new tokens
                    const requestData: any = {};
                    requestData['pw'] = environment.apiKey;
                    this.centralApiService.getJWTToken(requestData).subscribe((jwtData) => {
                        localStorage.setItem("access_token", jwtData["access_token"]);
                        localStorage.setItem("refresh_token", jwtData["refresh_token"]);
                        this.accessTokenSubject.next(true);
                        this.refreshingToken = false
                        return next.handle(this.addTokenHeader(request));
                    });
                }
            }
        }
        // add token if token is still valid
        return next.handle(this.addTokenHeader(request));
    }

    private addTokenHeader(request: HttpRequest<any>) {
        // return request.clone({ headers: request.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token) });
        let access_token: string | null = localStorage.getItem("access_token");
        return request.clone({ headers: request.headers.set(TOKEN_HEADER_KEY, "Bearer " + access_token) });
      }
}
