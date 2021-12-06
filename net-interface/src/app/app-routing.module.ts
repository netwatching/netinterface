import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeviceComponent } from 'src/_components/device/device.component';
import { DeviceDetailsComponent } from './../_components/device-details/device-details.component';
import { HomeComponent } from 'src/_components/home/home.component';
import { LoginComponent } from 'src/_components/login/login.component';
import { AppComponent } from './app.component';
import { AuthService } from '../_services/auth.service';
import { AuthGuard } from './auth.guard';


const routes: Routes = [

  { path: 'devices', component: DeviceComponent, canActivate: [AuthGuard] },
  { path: 'devices/:deviceId', component: DeviceDetailsComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
