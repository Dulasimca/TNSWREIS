import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MasterService } from './services/master-data.service';


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

  constructor(private _router: Router, private masterService: MasterService) {
    this.isLoggedIn = false;
    this._router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (event.url === '/login') {
          this.hideHeader = true;
        } else {
          this.hideHeader = false;
        }
      }
    });
    this.masterService.initializeMaster();
  }

  // onOpenSideMenu() {
  //   console.log('insi');
  //   this.showNavBar = true;
  // }
}
