import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MessageService, Message } from 'primeng/api';
import { ResponseMessage } from '../Common-Modules/messages';
import { PathConstants } from '../Common-Modules/PathConstants';
import { RestAPIService } from '../services/restAPI.service';

@Component({
  selector: 'app-application-status',
  templateUrl: './application-status.component.html',
  styleUrls: ['./application-status.component.css']
})
export class ApplicationStatusComponent implements OnInit {

  aadharNo: number;
  mobNo: number;
  dob: any;
  yearRange: string;
  registeredDetails: any = [];
  status: any;
  msgs: Message[];
  studentName: any;

  constructor(private _datePipe: DatePipe, private _restApiService: RestAPIService, private _messageService: MessageService,
  ) { }

  ngOnInit(): void {

    const current_year = new Date().getFullYear();
    const start_year_range = current_year - 50;
    this.yearRange = start_year_range + ':' + current_year;
  }


  checkStatus() {
    this.registeredDetails = [];
    const params = {
      //  'AadharNo': this.aadharNo,
      //  'MobileNo': this.mobNo,
      // 'Dob': this._datePipe.transform(this.dob, 'MM/dd/yyyy')
       'AadharNo': '305278756145',
      'MobileNo': '9840227196',
      'Dob': '02/08/1997'
      // 'AadharNo': '370693533850',
      // 'MobileNo': '9850332574',
      // 'Dob': '04/05/1997'
      //  'AadharNo': '579244988209',
      // 'MobileNo': '7010166091',
      // 'Dob': '10/10/2002'
      // 'AadharNo': '214059715415',
      //  'MobileNo': '7604864955',
      //  'Dob': '01/06/2007'
    }
    this._restApiService.getByParameters(PathConstants.OnlineStudentRegistration_Get, params).subscribe(res => {
      if (res !== undefined && res !== null && res.length !== 0) {
        res.forEach(r => {
          this.status = r.districtApproval;
          this.studentName = r.studentName;

        })
        console.log('u',res)
        this.registeredDetails = res;
        if (this.status === 0) {
          // var msg = "District Approval status has been rejected! Please Contact TNWHO-Admin for further queries!"
          // this._messageService.clear();
          // this._messageService.add({
          //   key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR, life: 5000,
          //   summary: ResponseMessage.SUMMARY_REJECTED, detail: msg
          // });
          this.msgs = [{ severity: 'error', summary: 'Rejected', detail:'Hi' + ' ' + this.studentName +'!' + ' ' +  'Your District Approval has been rejected! Please Contact TNWHO-Admin for further queries.' }];
        } else {

        }
        if (this.status === 1) {
          // var msg = "District Approval status has been approved!"
          // this._messageService.clear();
          // this._messageService.add({
          //   key: 't-msg', severity: ResponseMessage.SEVERITY_SUCCESS, life: 5000,
          //   summary: ResponseMessage.SUMMARY_APPROVED, detail: msg
          // });
          this.msgs = [{ severity: 'success', summary: 'Approved', detail:'Hi' + ' ' + this.studentName +'!' + ' ' +  'Your District Approval has been approved!' }];

        } else {

        }
        if (this.status === 2) {
          this.msgs = [{ severity: 'warn', summary: 'Pending', detail: 'Hi' + ' ' + this.studentName +'!' + ' ' +  'Your District Approval status is still in pending!' }];

          // var msg = "District Approval status is still in pending"
          // this._messageService.clear();
          // this._messageService.add({
          //   key: 't-msg', severity: ResponseMessage.SEVERITY_WARNING, life: 5000,
          //   summary: ResponseMessage.SUMMARY_WARNING, detail: msg
          // });
        } else {

        }
      } else {
        this._messageService.clear();
        this._messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_WARNING,
          summary: ResponseMessage.SUMMARY_WARNING, detail: ResponseMessage.NoRecForCombination
        })
      }
    })
  }

  onSearch() {
  }

  onAadharChange() { }
}
