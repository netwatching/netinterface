import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeviceComponent } from 'src/_components/device/device.component';
import { HomeComponent } from 'src/_components/home/home.component';
import { AppComponent } from './app.component';

const routes: Routes = [
  { path: 'device', component: DeviceComponent },
  { path: '', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
