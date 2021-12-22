import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavBarComponent } from './../_components/nav-bar/nav-bar.component';
import { FooterComponent } from './../_components/footer/footer.component';
import { DeviceComponent } from './../_components/device/device.component';
import { DeviceDetailsComponent } from './../_components/device-details/device-details.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HomeComponent } from 'src/_components/home/home.component';
import { AlertsComponent } from 'src/_components/alerts/alerts.component';
import { FormsModule } from '@angular/forms';
import { IPublicClientApplication,
  PublicClientApplication,
  BrowserCacheLocation } from '@azure/msal-browser';
import { MsalModule,
  MsalService,
  MSAL_INSTANCE } from '@azure/msal-angular';
import { OAuthSettings } from '../_interfaces/oauth';
import { JwtInterceptor } from '../_interceptors/jwt.interceptor';
import { HomeDevicesComponent } from './../_components/home-devices/home-devices.component';
import { HomeAlertsComponent } from './../_components/home-alerts/home-alerts.component';



let msalInstance: IPublicClientApplication | undefined = undefined;

export function MSALInstanceFactory(): IPublicClientApplication {
  msalInstance = msalInstance ?? new PublicClientApplication({
    auth: {
      clientId: OAuthSettings.appId,
      redirectUri: OAuthSettings.redirectUri,
      postLogoutRedirectUri: OAuthSettings.redirectUri,
    },
    cache: {
      cacheLocation: BrowserCacheLocation.LocalStorage,
    }
  });

  return msalInstance;
}

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    FooterComponent,
    DeviceComponent,
    DeviceDetailsComponent,
    HomeComponent,
    AlertsComponent,
    HomeDevicesComponent,
    HomeAlertsComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    MsalModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory
    },
    MsalService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
