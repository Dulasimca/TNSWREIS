import { LocationStrategy } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import { ResponseMessage } from '../Common-Modules/messages';
import { PathConstants } from '../Common-Modules/PathConstants';
import { User } from '../interfaces/user';
import { AuthService } from '../services/auth.service';
import { MasterService } from '../services/master-data.service';
import { RestAPIService } from '../services/restAPI.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: string;
  password: string;
  showPswd: boolean;

  constructor(private _authService: AuthService, private _messageService: MessageService,
    private _restApiService: RestAPIService) { }

  ngOnInit(): void { }

  onShowPswd() {
    var inputValue = (<HTMLInputElement>document.getElementById('pswd'));
    if (inputValue.type === 'password') {
      inputValue.type = 'text';
      this.showPswd = !this.showPswd;
    } else {
      this.showPswd = !this.showPswd;
      inputValue.type = 'password';
    }
  }

  onLogin() {
    const params = {
      UserId: this.username,
      Password: this.password,
    }
    this._restApiService.post(PathConstants.Login, params).subscribe(response => {
      if (response !== undefined && response !== null) {
        if (response.item1) {
          if (response.item3.length !== 0) {
            response.item3.forEach(i => {
              const obj: User = {
                username: (i.userName !== undefined && i.userName !== null) ? i.userName : ''
                , userID: (i.id !== undefined && i.id !== null) ? i.id : null
                , emailId: (i.eMailId !== undefined && i.eMailId !== null) ? i.eMailId : ''
                , hostelId: (i.hostelID !== undefined && i.hostelID !== null) ? i.hostelID : null
                , talukId: (i.talukid !== undefined && i.talukid !== null) ? i.talukid : null
                , districtCode: (i.districtcode !== undefined && i.districtcode !== null) ? i.districtcode : null
                , roleId: (i.roleId !== undefined && i.roleId !== null) ? i.roleId : null
                , token: (i.entryptedPwd !== undefined && i.entryptedPwd !== null) ? i.entryptedPwd : ''
                , hostelName: (i.hostelName !== undefined && i.hostelName !== null) ? i.hostelName: ''
              }
              console.log('user', obj);
              this._authService.login(obj);
            });
          } else {
            this._messageService.clear();
            this._messageService.add({
              key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
              summary: ResponseMessage.SUMMARY_ERROR, detail: response.item2
            });
          }
        } else {
          this._messageService.clear();
          this._messageService.add({
            key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
            summary: ResponseMessage.SUMMARY_ERROR, detail: response.item2
          })
        }
      } else {
        this._messageService.clear();
        this._messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
          summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.ErrorMessage
        })
      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 0 || err.status === 400) {
        this._messageService.clear();
        this._messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
          summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.ErrorMessage
        })
      } else {
        this._messageService.clear();
        this._messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
          summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.NetworkErrorMessage
        })
      }
    })
  }
}
