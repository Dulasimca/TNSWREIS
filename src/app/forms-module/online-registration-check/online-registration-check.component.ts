import { Component, OnInit, ViewChild } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { MasterService } from 'src/app/services/master-data.service';
import { Observable } from 'rxjs';
import { MessageService, SelectItem } from 'primeng/api';
import { ResponseMessage } from 'src/app/Common-Modules/messages';
import { DatePipe } from '@angular/common';
import { RestAPIService } from 'src/app/services/restAPI.service';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { TableConstants } from 'src/app/Common-Modules/table-constants';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { saveAs } from 'file-saver';
import { GlobalVariable } from 'src/app/Common-Modules/GlobalVariables';

@Component({
  selector: 'app-online-registration-check',
  templateUrl: './online-registration-check.component.html',
  styleUrls: ['./online-registration-check.component.css']
})
export class OnlineRegistrationCheckComponent implements OnInit {

  dob: any;
  aadharNo: string;
  yearRange: string;
  mobileNo: string;
  response: any;
  registeredDetails: any = [];
  enableField: boolean;
  feedbackRegData: any = [];
  showDialog: boolean;
  registeredCols: any;
  pdfDialog: boolean;
  loading: boolean;
  aadharValidationMsg: string;
  pdfSource: any;
  src: any;
  showPdf : boolean;

  @BlockUI() blockUI: NgBlockUI;
  @ViewChild('f', { static: false }) _onlineRegistrationCheck: NgForm;
  studentId: string;
  hostelId: any;
  constructor(private _masterService: MasterService, private _messageService: MessageService,
    private _datePipe: DatePipe, private _restApiService: RestAPIService, private _tableConstants: TableConstants,
    private _router: Router) { }
    // ngAfterViewInit() {
    //   var src = 'assets/layout/images/check.pdf';
    //   document.getElementById("embedPDF").setAttribute('src', src);
    //    }
    

  ngOnInit(): void {
    this.yearRange = GlobalVariable.START_YEAR_RANGE + ':' + GlobalVariable.STUDENT_DOB_MAX_YEAR;
    // this.registeredCols = this._tableConstants.registrationColumns;
  }

  loadStudentsData() {
    this.registeredDetails = [];
    this.loading = true;
    const params = {
      'AadharNo': this.aadharNo,
      'MobileNo': this.mobileNo,
      'Dob': this._datePipe.transform(this.dob, 'MM/dd/yyyy')
    }
    this._restApiService.getByParameters(PathConstants.OnlineStudentRegistration_Get, params).subscribe(res => {
      if (res !== undefined && res !== null && res.length !== 0) {
        res.forEach(r => {
          this.studentId = r.studentId;
          this.hostelId = r.hostelId;
          console.log('d', this.studentId)
          var len = r.aadharNo.toString().length;
          if (len > 11) {
            r.aadharNoMasked = '*'.repeat(len - 4) + r.aadharNo.substr(8, 4);
          }
        })
        this.registeredDetails = res.slice(0);
        // this.showDialog = true;
        // this.pdfDialog = true;
        this.onDialogShow();
        this.loading = false;
        this.onClear();
      } else {
        this.onClear();
        this.loading = false;
        this._messageService.clear();
        this._messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_WARNING,
          summary: ResponseMessage.SUMMARY_ALERT, detail: 'Not yet registered! Please register'
        })
      }
    })
  } 
  onDownload(Filename) {
    this.pdfDialog = true;
  }

  onDialogShow() {
    var src = 'assets/layout/Reports/' + this.hostelId+ '/' + this.aadharNo + '_' + this.studentId + '.pdf';
    document.getElementById("embedPDF").setAttribute('src', src);
  }

  onClear() {
    this._onlineRegistrationCheck.reset();
    this._onlineRegistrationCheck.form.markAsUntouched();
    this._onlineRegistrationCheck.form.markAsPristine();
    this.aadharNo = null;
    this.dob = null;
    this.mobileNo = null;
  }

  // validateAadhaar(aadhaarString) {
  //   // The multiplication table
  //   if (aadhaarString.length != 12) {
  //     this.aadharValidationMsg = 'Aadhaar numbers should be 12 digits !';
  //   } else {
  //     this.aadharValidationMsg = '';
  //   }
  //   if (aadhaarString.match(/[^$,.\d]/)) {
  //     this.aadharValidationMsg = 'Aadhaar numbers must contain only numbers !';
  //   } else {
  //     this.aadharValidationMsg = '';
  //   }
  //   var aadhaarArray = aadhaarString.split('');
  //   var toCheckChecksum = aadhaarArray.pop();
  //   if (this.generate(aadhaarArray) == toCheckChecksum) {
  //     this.aadharValidationMsg = '';
  //     this.maskInput(aadhaarString)
  //     return true;
  //   } else {
  //     this.aadharValidationMsg = 'Invalid Aadhar No!';
  //     this._onlineRegistrationCheck.form.controls._aadharno.invalid;
  //     if (this.aadharNo.length === 12) {
  //       setTimeout(() => {
  //         this.aadharNo = null;
  //         this.aadharValidationMsg = 'Please enter valid Aadhar No!';
  //   }, 300);
  //     }
  //     return false;
  //   }
  // }

  // // generates checksum
  // generate(array) {
  //   var d = [
  //     [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  //     [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
  //     [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
  //     [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
  //     [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
  //     [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
  //     [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
  //     [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
  //     [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
  //     [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
  //   ];
  //   // permutation table p
  //   var p = [
  //     [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  //     [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
  //     [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
  //     [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
  //     [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
  //     [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
  //     [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
  //     [7, 0, 4, 6, 9, 1, 3, 2, 5, 8]
  //   ];
  //   // inverse table inv
  //   var inv = [0, 4, 3, 2, 1, 5, 6, 7, 8, 9];
  //   var c = 0;
  //   var invertedArray = array.reverse();
  //   for (var i = 0; i < invertedArray.length; i++) {
  //     c = d[c][p[((i + 1) % 8)][invertedArray[i]]];
  //   }
  //   return inv[c];
  // }

  // maskInput(value) {
  //   this.aadharNo = value;
  //   var len = value.length;
  //   if (len > 11) {
  //     this.aadharNo = '*'.repeat(len - 4) + value.substr(8, 4);
  //   }
  // }



}

