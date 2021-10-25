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
import { DatePipe } from '@angular/common';


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
  districts : any;
  taluks : any;
  @BlockUI() blockUI: NgBlockUI;
  @ViewChild('f', { static: false }) attendanceForm: NgForm;
  constructor( private http: HttpClient, private restApiService: RestAPIService, 
    private masterService: MasterService, private messageService: MessageService, private authService: AuthService,private datepipe: DatePipe) { }
  ngOnInit(): void {
    this.districts = this.masterService.getMaster('DT');
    this.taluks = this.masterService.getMaster('TK');
    this.login_user = this.authService.UserInfo;
    this.hostelname =this.login_user.hostelName;
    this.HostelId = this.login_user.hostelId;
    this.DistrictId = this.login_user.districtCode;
    this.TalukId = this.login_user.talukId;
    this.districts.forEach(d => {
      if(this.DistrictId==d.code)
      {
        this.districtname=d.name
      }
    });
    this.taluks.forEach(d => {
      if(this.TalukId==d.code)
      {
        this.taluknname=d.name
      }
    });
  // HostelId : number
  // DistrictId : number
  // districtname
    this.cols = [
      {field:'Id',header: 'Id'},
      {field:'HotelName',header: 'Hostel Name'},
      {field:'DistrictName',header: 'District Name'},
      {field:'TalukName',header: 'Taluk Name'},
      {field:'AttendanceDate',header: 'Attendance Date'},
      {field:'NOOfStudent',header: 'NO Of Student'},
      {field:'Remarks',header: 'Remarks'},
      //{field:'Flag',header: 'Status'},


    ];

  }
  onSubmit() {
    this.blockUI.start();
    const params = {
      'Id': 0, 
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
       this.onClear();
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
    const params={
      'HostelID' : this.HostelId,	
     'Districtcode'	: this.DistrictId ,
     'Talukid'		:this.TalukId,
    'FromDate'		:this.datepipe.transform(this.date,'MM/dd/yyyy'), 
     'Todate'		:this.datepipe.transform(this.date,'MM/dd/yyyy')
    }
    this.restApiService.getByParameters(PathConstants.Attendance_Get,params).subscribe(res => {
     if(res !== null && res !== undefined && res.length !==0) {
       this.data = res.Table;
     }
   });
 
 
 }
  onRowSelect(event, selectedRow) {
    
     this.date = selectedRow.Id;
     this.HostelId = selectedRow.HostelID;
     this.DistrictId = selectedRow.Districtcode;
     this.TalukId = selectedRow.Talukid;
     this.hostelname = selectedRow.HostelName;
     this.districtname = selectedRow.DistrictName;
     this.taluknname = selectedRow.TalukName;
     this.date = selectedRow.AttendanceDate;
     this.no_of_student = selectedRow.NOOfStudent;
     this.remarks = selectedRow.Remarks;
     

  }
onClear(){
  this.attendanceForm.reset();
    this.attendanceForm.form.markAsUntouched();
    this.attendanceForm.form.markAsPristine();
    this.hostelname='',
    this.districtname='',
    this.taluknname='',
    this.no_of_student='',
    this.remarks=''

}

}
    