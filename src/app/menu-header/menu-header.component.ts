import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
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
      if(this.showMenu) {
        this.items = this._authService.menu;
      }
    });
  }

  ngOnInit(): void { }

  onSignIn() {
    this._router.navigate(['/login']);
  }
  
  public onToggleSidenav = () => {
    console.log('emit')
    this.sidenavToggle.emit();
  }

}
