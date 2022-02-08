import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { User } from '../interfaces/user';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-menu-header',
  templateUrl: './menu-header.component.html',
  styleUrls: ['./menu-header.component.css']
})
export class MenuHeaderComponent implements OnInit {
  @Output() public sidenavToggle = new EventEmitter();
  items: MenuItem[] = [];
  showMenu: boolean = false;
  hideHeader: boolean = false;
  username: string;
  place: string;
  logged_user: User;
  roleId: number;
  constructor(private _authService: AuthService, private _router: Router) {
    this._router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (event.url === '/login') {
          this.hideHeader = true;
        } else {
          this.hideHeader = false;
        }
      }
    });
    this._authService.isLoggedIn.subscribe(value => {
      this.showMenu = value;
      this.logged_user = this._authService.UserInfo;
      if (this.showMenu) {
        this.items = this._authService.menu;
        if (this.items.length !== 0) {
          this.items.forEach(i => {
             if(i.label === 'Logout') {
              i.command = () => { this.onLogout(); };
            }
          })
        }
      }
      this.username = this.logged_user.username;
      this.roleId = (this.logged_user.roleId * 1);
      this.place = ((this.logged_user.roleId * 1) === 3 || (this.logged_user.roleId * 1) === 4) ? this.logged_user.talukName :
       ((this.logged_user.roleId * 1) === 2) ? this.logged_user.districtName : '';
    });
  }

  ngOnInit(): void { }

  onLogout() {
    this._authService.logout();
  }

  onSignIn() {
    this._router.navigate(['/login']);
  }

  public onToggleSidenav = () => {
    this.sidenavToggle.emit();
  }

}
