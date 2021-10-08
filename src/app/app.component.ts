import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './services/auth.service';
import { MasterService } from './services/master-data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'TNMenu';
  hideHeader: boolean = false;
  isLoggedIn: boolean = false;
  // showNavBar: boolean;
  // items: any[];

  constructor(private _router: Router, private _authService: AuthService, private _masterService: MasterService) {
    this._authService.isLoggedIn.subscribe(value => {
      this.isLoggedIn = value;
      console.log('log', this.isLoggedIn);
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

  ngOnInit() {
    let master = new Observable<any[]>();
    master = this._masterService.initializeMaster();
    master.subscribe(response => {
      if(response) {
        console.log('res', response);
      }
    });
  }
  // onOpenSideMenu() {
  //   console.log('insi');
  //   this.showNavBar = true;
  // }
}
