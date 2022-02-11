import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MessageService, SelectItem } from 'primeng/api';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { RestAPIService } from 'src/app/services/restAPI.service';
import { ResponseMessage } from 'src/app/Common-Modules/messages';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {
  hostelName: string;
  studentName: string;
  feedBack: string;
  login_user: User;
  cols: any;
  data: any = [];
  Districtid: number;
  Hostelid: number;
  TalukId: number;
  studentid: number;

  constructor(private _authService: AuthService,private _restApiService: RestAPIService,private _messageService: MessageService
    ,private http: HttpClient) { }

  ngOnInit(): void {
    this.login_user = this._authService.UserInfo;
    this.hostelName = this.login_user.hostelName;
    this.studentName = this.login_user.username
    this.Districtid = this.login_user.districtCode;
    this.Hostelid = this.login_user.hostelId;
    this.TalukId = this.login_user.talukId;
    this.studentid = this.login_user.userID;
  }
  public uploadFile = (files) => {
    if (files.length === 0) {
      return;
    }
    var formData = new FormData()
    let fileToUpload: any = <File>files[0];
    let actualFilename = '';
    const folderName = this.login_user.hostelId + '/' + 'Documents';
    const filename = fileToUpload.name + '^' + folderName;
    formData.append('file', fileToUpload, filename);
    actualFilename = fileToUpload.name;
    this.http.post(this._restApiService.BASEURL + PathConstants.FileUpload_Post, formData)
      .subscribe((event: any) => {
      }
      );
    return actualFilename;
  }

  onSubmit() {
    const params = {
      'Slno': 0,
      'HostelId': this.Hostelid,
      'DistrictId': this.Districtid,
      'TalukId': this.TalukId,
      'StudentId': 215,
      'FBMessage': this.feedBack,
      'ImgFileName':'img.jpg',
      // 'ReplyMessage': ,
      // 'ActionDate':,
      'Flag': 1,
    };
    this._restApiService.post(PathConstants.FeedBack_Post,params).subscribe(res => {
      if (res !== undefined && res !== null) {
        if (res) {
          // this.blockUI.stop();
           this.onClear();
          this._messageService.clear();
          this._messageService.add({
            key: 't-msg', severity: ResponseMessage.SEVERITY_SUCCESS,
            summary: ResponseMessage.SUMMARY_SUCCESS, detail: ResponseMessage.SuccessMessage
          });

        } else {
          // this.blockUI.stop();
          this._messageService.clear();
          this._messageService.add({
            key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
            summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.ErrorMessage
          });
        }
      } else {
        this._messageService.clear();
        this._messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
          summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.ErrorMessage
        });
      }
    }, (err: HttpErrorResponse) => {
      // this.blockUI.stop();
      if (err.status === 0 || err.status === 400) {
        this._messageService.clear();
        this._messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
          summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.ErrorMessage
        })

      }
    })


  }


  onClear() {

  }

}
