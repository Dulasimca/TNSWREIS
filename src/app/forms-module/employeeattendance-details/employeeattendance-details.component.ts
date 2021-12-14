import { Component, OnInit } from '@angular/core';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { User } from 'src/app/interfaces/user';
import { RestAPIService } from 'src/app/services/restAPI.service';
import { MessageService, SelectItem } from 'primeng/api';
import { ResponseMessage } from 'src/app/Common-Modules/messages';

@Component({
  selector: 'app-employeeattendance-details',
  templateUrl: './employeeattendance-details.component.html',
  styleUrls: ['./employeeattendance-details.component.css']
})
export class EmployeeattendanceDetailsComponent implements OnInit {
  attendanceDate: any;
  cols: any;
  data: any = [];
  login_user : User;
  Districtcode: number;
  TalukId: number;
  HostelId: number;
  selectedType: number;

  constructor(private _restApiService: RestAPIService,private _messageService: MessageService) { }

  ngOnInit(): void {
    
    this.cols = [
      { field:'FirstName', header: 'Employee Name', width: '100px', align: 'left !important'},
      { field:'FirstName', header: 'Remarks', width: '100px', align: 'left !important'},
    ];
    
    this.Districtcode = this.login_user.districtCode;
    this.TalukId = this.login_user.talukId;
    this.HostelId = this.login_user.hostelId;
  }

  onView() {
    this.data = [];
    const params = {
   'DCode' : this.login_user.districtCode,
   'TCode' : this.login_user.talukId,
   'HostelId' : this.login_user.hostelId,
    }
    this._restApiService.getByParameters(PathConstants.EmployeeDetails_Get,params).subscribe(res =>{
      if (res !== null && res !== undefined && res.length !== 0) {
        res.Table.forEach(i => {
          this.data = res.Table;
    })
    
  } else {
    this._messageService.clear();
    this._messageService.add({
      key: 't-msg', severity: ResponseMessage.SEVERITY_WARNING,
      summary: ResponseMessage.SUMMARY_WARNING, detail: ResponseMessage.NoRecordMessage
    })
  }
});
  }

  onRowSelect(event, selectedRow) { 

  }

}
