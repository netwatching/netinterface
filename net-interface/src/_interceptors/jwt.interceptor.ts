// import { Injectable } from '@angular/core';
// import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
// import { from, Observable, throwError } from 'rxjs';
// import { catchError, switchMap } from 'rxjs/operators';
// import { CentralApiService } from '../_services/central-api.service';
// import { User } from '../_interfaces/user';
// import { AuthService } from '../_services/auth.service';

// @Injectable()
// export class JWTInterceptor implements HttpInterceptor {

//   private BASE_URL = 'http://palguin.htl-vil.local:8081/api'
//   constructor(public centralApiService: CentralApiService, public authService: AuthService) {}
//   intercept(request: HttpRequest < any > , next: HttpHandler): Observable < HttpEvent < any >> {
//     console.log("kumm bis zur auth")
//     if (request.url.startsWith(this.BASE_URL)) {
//       const requestData: any = {};
//       requestData['id'] = this.authService.user!.id
//       requestData['name'] = this.authService.user!.username
//       requestData['pw'] = 'TYlZfng0wwuEOaxcyyoJ2N5otTPS0g4X6fXq9s777yJxwtcpHsRQC1F5Ao5PI3MT42xlMeBOP4jN7fUAA5a5vEtM7WWIMYvQPDebr5Lcgz9Ri1yEQiwmObINIHyI8pMw'
//       return from(this.centralApiService.getJWTToken(requestData))
//         .pipe(

//           catchError((error: HttpErrorResponse) => {
//             console.error(`Error retrieving Eventstream token: ${error.message}`)
//             return next.handle(request);
//           }),
//           switchMap(token => {
//             console.log("des is da guate tooooukn", token)
//             const headers = request.headers
//               .set('Authorization', 'Bearer ' + token)
//               .append('Cache-Control', 'no-cache')
//               .append('Pragma', 'no-cache');
//             const requestClone = request.clone({
//               headers
//             });
//             return next.handle(requestClone);
//           })
//         )
//     } else {
//       return next.handle(request);
//     }
//   }
// }


import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { CentralApiService } from '../_services/central-api.service';
import { User } from '../_interfaces/user';
import { AuthService } from '../_services/auth.service';

const TOKEN_HEADER_KEY = 'Authorization';

@Injectable()
export class JWTInterceptor implements HttpInterceptor {
  constructor(public centralApiService: CentralApiService, public authService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    let authReq = req;
    console.log("interceptors")

    const requestData: any = {};
    requestData['id'] = this.authService.user!.id
    requestData['name'] = this.authService.user!.username
    requestData['pw'] = 'TYlZfng0wwuEOaxcyyoJ2N5otTPS0g4X6fXq9s777yJxwtcpHsRQC1F5Ao5PI3MT42xlMeBOP4jN7fUAA5a5vEtM7WWIMYvQPDebr5Lcgz9Ri1yEQiwmObINIHyI8pMw'

    const token = this.centralApiService.getJWTToken(requestData);
    console.log(token)

    if (token != null) {
      authReq = req.clone({ headers: req.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token) });
    }
    return next.handle(authReq);
  }
}

// export const authInterceptorProviders = [
//   { provide: HTTP_INTERCEPTORS, useClass: JWTInterceptor, multi: true }
// ];
