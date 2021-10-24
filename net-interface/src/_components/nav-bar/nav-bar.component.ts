import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

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

  constructor() {

  }

  ngOnInit() {

  }

  toggleNavbar() {
    this.nav_burger.nativeElement.classList.toggle('is-active');
    this.nav_menu.nativeElement.classList.toggle('is-active');
  }

}
