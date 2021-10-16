import {Component, OnInit} from '@angular/core';
import {User} from '../../_interfaces/user';
import {AuthService} from '../../_services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {

  // Is a user logged in?
  get authenticated(): boolean {
    return this.authService.authenticated;
  }
  // The user
  get user(): User | undefined {
    return this.authService.user;
  }

  constructor(private authService: AuthService) {}

  ngOnInit() {}

  async signIn(): Promise < void > {
    await this.authService.signIn();
  }

}
