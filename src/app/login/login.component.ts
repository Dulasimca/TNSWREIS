import { LocationStrategy } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user';
import { AuthService } from '../services/auth.service';
import { MasterService } from '../services/master-data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: string;
  password: string;

  constructor(private _masterService: MasterService, private _authService: AuthService) { }

  ngOnInit(): void {
    // let master = new Observable<any[]>();
    // master = this._masterService.initializeMaster();
    // master.subscribe(response => {
    //   if(response) {
    //     console.log('res', response);
    //   }
    // });
  }

  onLogin() {
    const userInfo: User = {
      username: this.username,
      password: this.password,
      userID: 0,
      hostelId: 1
    }
    this._authService.login(userInfo);
   }

}
