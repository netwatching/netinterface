import { Component, OnInit } from '@angular/core';
import { User } from '../../_interfaces/user';
import { AuthService } from '../../_services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

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
  }
}

