import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../_services/auth.service';
import { User } from '../../_interfaces/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  get authenticated(): boolean {
    return this.authService.authenticated;
  }

  get user(): User | undefined {
    return this.authService.user;
  }

  constructor(private authService: AuthService) { }

  ngOnInit() { }

  async signIn(): Promise<void> {
    await this.authService.signIn();
    if (this.authService.authenticated){
      window.location.href = '';
    }
  }
}
