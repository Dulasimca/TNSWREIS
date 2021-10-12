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

  constructor(private _authService: AuthService, private _messageService: MessageService,
    private _restApiService: RestAPIService) { }

  ngOnInit(): void { }

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
                username: (i.UserName !== undefined && i.UserName !== null) ? i.UserName : ''
                , userID: (i.Id !== undefined && i.Id !== null) ? i.Id : null
                , emailId: (i.EMailId !== undefined && i.EMailId !== null) ? i.EMailId : ''
                , hostelId: (i.HostelID !== undefined && i.HostelID !== null) ? i.HostelID : null
                , talukId: (i.Talukid !== undefined && i.Talukid !== null) ? i.Talukid : null
                , districtCode: (i.Districtcode !== undefined && i.Districtcode !== null) ? i.Districtcode : null
                , roleId: (i.RoleId !== undefined && i.RoleId !== null) ? i.RoleId : null
                , token: (i.EntryptedPwd !== undefined && i.EntryptedPwd !== null) ? i.EntryptedPwd : ''
              }
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
      }
    })
  }
}
