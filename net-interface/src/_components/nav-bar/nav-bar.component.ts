import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { User } from '../../_interfaces/user';
import { AuthService } from '../../_services/auth.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {

  @ViewChild('navBurger')
  nav_burger!: ElementRef;

  @ViewChild('navMenu')
  nav_menu !: ElementRef;


  get authenticated(): boolean {
    return this.authService.authenticated;
  }

  get user(): User | undefined {
    return this.authService.user;
  }

  constructor(private authService: AuthService) {}

  ngOnInit() {}

  toggleNavbar() {
    this.nav_burger.nativeElement.classList.toggle('is-active');
    this.nav_menu.nativeElement.classList.toggle('is-active');
  }

  async signIn(): Promise<void> {
    await this.authService.signIn();
  }

  signOut(): void {
    this.authService.signOut();
  }

}
