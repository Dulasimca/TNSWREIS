import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ResponseMessage } from 'src/app/Common-Modules/messages';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { RestAPIService } from 'src/app/services/restAPI.service';


@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
  logged_user: User;
  showErrMsg: boolean;

  constructor(private _restApiService: RestAPIService, private _authService: AuthService,
    private _messageService: MessageService) { }

  ngOnInit(): void {
    this.logged_user = this._authService.UserInfo;

  }

  onSubmit() {
    const params = {
      'NewPwd': this.newPassword,
      'OldPwd': this.oldPassword,
      'OldEncryptedPwd': this.logged_user.token,
      'UserId': this.logged_user.userID
    }
    this._restApiService.put(PathConstants.UserMaster_Put, params).subscribe(res => {
      if (res.item1) {
        this._messageService.clear();
        this._messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_SUCCESS,
          // summary: ResponseMessage.SUMMARY_SUCCESS, detail: ResponseMessage.PasswordChangeSuccess
        });
      } else {
        this._messageService.clear();
        this._messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_SUCCESS,
          summary: ResponseMessage.SUMMARY_SUCCESS, detail: res.item2
        });
      }
    })
  }

  checkPassword(event) {
    console.log('eve', event);
    const value: string = event.data;
    console.log('Entered', value);
    if (value !== undefined && value !== '') {
      if (this.newPassword !== undefined && this.newPassword !== null && this.newPassword !== '' &&
        this.confirmPassword !== undefined && this.confirmPassword !== null && this.confirmPassword !== '') {
          if(value.trim() !== this.newPassword.trim()) {
            console.log('if cond')
            this.showErrMsg = true;
          } else {
            this.showErrMsg = false;
          }
      }
    }
  }

}
