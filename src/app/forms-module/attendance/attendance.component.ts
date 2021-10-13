import { Component, OnInit,ViewChild } from '@angular/core';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { RestAPIService } from 'src/app/services/restAPI.service';
import { MessageService } from 'primeng/api';
import { MasterService } from 'src/app/services/master-data.service';
import { HttpClient } from '@angular/common/http';
import { ResponseMessage } from 'src/app/Common-Modules/messages';
import { BlockUI, NgBlockUI } from 'ng-block-Ui';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { User } from 'src/app/Interfaces/user';
import { AuthService } from 'src/app/Services/auth.service';


@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css']
})
export class AttendanceComponent implements OnInit {

  date: Date = new Date();
  districtname:any 
  data:any
  cols:any
  hostelname:string
  HostelId : number
  DistrictId : number
  TalukId : number
  taluknname:string
  no_of_student:string
  remarks:string
  login_user: User;
  @BlockUI() blockUI: NgBlockUI;
  @ViewChild('f', { static: false }) _registrationForm: NgForm;
  constructor( private http: HttpClient, private restApiService: RestAPIService, 
    private masterService: MasterService, private messageService: MessageService, private authService: AuthService) { }
  ngOnInit(): void {
    this.login_user = this.authService.UserInfo;
  //   this.hostelname =this.login_user.hostelId;
  // HostelId : number
  // DistrictId : number
  // districtname
    this.cols = [
      {field:'date',header: 'Id'},
      {field:'hostel_name',header: 'Hostel Name'},
      {field:'districtn',header: 'District Name'},
      {field:'Royapuram',header: 'Taluk Name'},
      {field:'date',header: 'Attendance Date'},
      {field:'no_of_student',header: 'NO Of Student'},
      {field:'remarks',header: 'Remarks'},
      //{field:'Flag',header: 'Status'},


    ];

  }
  onSubmit() {
    this.blockUI.start();
    const params = {
      'Id': this.date, 
      'HostelID': this.HostelId, 
      'Districtcode': this.DistrictId, 
      'Talukid': this.TalukId, 
      'AttendanceDate': this.date, 
      'NOOfStudent': this.no_of_student, 
      'Remarks': this.remarks, 
      'Flag': 1, 
    };
    this.restApiService.post(PathConstants.Attendance_Post, params).subscribe(res => {
      if(res !== undefined && res !== null) {
        if (res) {
         this.blockUI.stop();
      // this.onClear();
       this.messageService.clear();
       this.messageService.add({
         key: 't-msg', severity: ResponseMessage.SEVERITY_SUCCESS,
         summary: ResponseMessage.SUMMARY_SUCCESS, detail: ResponseMessage.SuccessMessage
       });
      
     } else {
       this.blockUI.stop();
       this.messageService.clear();
       this.messageService.add({
         key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
         summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.ErrorMessage
       });
     }
     } else {
     this.messageService.clear();
     this.messageService.add({
       key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
       summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.ErrorMessage
     });
     }
     }, (err: HttpErrorResponse) => {
      this.blockUI.stop();
     if (err.status === 0 || err.status === 400) {
       this.messageService.clear();
       this.messageService.add({
         key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
         summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.ErrorMessage
      })
    
    }
   })
}
  onview() {
    this.restApiService.get(PathConstants.Attendance_Get).subscribe(res => {
     if(res !== null && res !== undefined && res.length !==0) {
       this.data = res.Table;
     }
     
   });
 
 
 }
  onRowSelect(event, selectedRow) {
    
     this.date = selectedRow.Id;
     this.hostel_name = selectedRow.HostelID;
     this.districtn = selectedRow.Districtcode;
     this.talukn = selectedRow.Talukid;
     this.date = selectedRow.AttendanceDate;
     this.no_of_student = selectedRow.NOOfStudent;
     this.remarks = selectedRow.Remarks;
     

  }


}
    