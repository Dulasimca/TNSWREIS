import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'TNMenu';
  hideHeader: boolean = false;
  isLoggedIn: boolean;
  // showNavBar: boolean;
  // items: any[];

  constructor(private _router: Router, private _authService: AuthService) {
    this._authService.isLoggedIn.subscribe(value => {
      this.isLoggedIn = value;
    });
    this._router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (event.url === '/login') {
          this.hideHeader = true;
        } else {
          this.hideHeader = false;
        }
      }
    });
  }
  // onOpenSideMenu() {
  //   console.log('insi');
  //   this.showNavBar = true;
  // }
}
