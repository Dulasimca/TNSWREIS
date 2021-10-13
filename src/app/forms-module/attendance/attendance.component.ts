import { Component, OnInit } from '@angular/core';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { RestAPIService } from 'src/app/services/restAPI.service';
import { MessageService } from 'primeng/api';
import { MasterService } from 'src/app/services/master-data.service';
import { HttpClient } from '@angular/common/http';
import { ResponseMessage } from 'src/app/Common-Modules/messages';
import { BlockUI, NgBlockUI } from 'ng-block-Ui';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css']
})
export class AttendanceComponent implements OnInit {

  date: Date = new Date();
  Northchennai:any 
  data:any
  cols:any
  hostel_name:string
  Royapuram:string
  no_of_student:string
  remarks:string

  constructor( private http: HttpClient, private restApiService: RestAPIService, 
    private masterService: MasterService, private messageService: MessageService
   ) { }
  ngOnInit(): void {
    this.cols = [
      {field:'date',header: 'Id'},
      {field:'hostel_name',header: 'Hostel Name'},
      {field:'Northchennai',header: 'District Name'},
      {field:'Royapuram',header: 'Taluk Name'},
      {field:'date',header: 'Attendance Date'},
      {field:'no_of_student',header: 'NO Of Student'},
      {field:'remarks',header: 'Remarks'},
      //{field:'Flag',header: 'Status'},


    ];

  }
  onSubmit() {
    const params = {
      'Id': this.date, 
      'HostelID': this.hostel_name, 
      'Districtcode': this.Northchennai, 
      'Talukid': this.Royapuram, 
      'AttendanceDate': this.date, 
      'NOOfStudent': this.no_of_student, 
      'Remarks': this.remarks, 
      'Flag': 1, 
    };
    this.restApiService.post(PathConstants.Attendance_Post, params).subscribe(res => {
      if(res !== undefined && res !== null) {
        if (res) {
         // this.blockUI.stop();
      // this.onClear();
       this.messageService.clear();
       this.messageService.add({
         key: 't-msg', severity: ResponseMessage.SEVERITY_SUCCESS,
         summary: ResponseMessage.SUMMARY_SUCCESS, detail: ResponseMessage.SuccessMessage
       });
      
     } else {
      // this.blockUI.stop();
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
    // this.blockUI.stop();
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
     this.Northchennai = selectedRow.Districtcode;
     this.Royapuram = selectedRow.Talukid;
     this.date = selectedRow.AttendanceDate;
     this.no_of_student = selectedRow.NOOfStudent;
     this.remarks = selectedRow.Remarks;
     

  }


}
    