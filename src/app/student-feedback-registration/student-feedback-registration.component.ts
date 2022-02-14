import { HttpErrorResponse } from '@angular/common/http';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MessageService, SelectItem } from 'primeng/api';
import { ResponseMessage } from '../Common-Modules/messages';
import { PathConstants } from '../Common-Modules/PathConstants';
import { User } from '../interfaces/user';
import { AuthService } from '../services/auth.service';
import { MasterService } from '../services/master-data.service';
import { RestAPIService } from '../services/restAPI.service';

@Component({
  selector: 'app-student-feedback-registration',
  templateUrl: './student-feedback-registration.component.html',
  styleUrls: ['./student-feedback-registration.component.css']
})
export class StudentFeedbackRegistrationComponent implements OnInit {

  district: any;
  taluk: any;
  hostel: any;
  aadharNo: string;
  dob: any;
  email: any;
  studentName: any;
  yearRange: any;
  districtOptions: SelectItem[];
  talukOptions: SelectItem[];
  hostelOptions: SelectItem[];
  districts?: any;
  taluks?: any;
  hostels?: any;
  StudentsData: any = [];
  logged_user: User;
  StudentId: any;
  @ViewChild('f', { static: false }) _studentFeedback: NgForm;
  enableField: boolean;
  userMasterId: string;
  userData: any = [];
  checkEmail: boolean;
  feedbackRegData: any = [];

  constructor(private _authService: AuthService, private _restApiService: RestAPIService, private _masterService: MasterService,
    private _messageService: MessageService) { }

  ngOnInit(): void {
    const current_year = new Date().getFullYear();
    const start_year_range = current_year - 30;
    this.yearRange = start_year_range + ':' + current_year;
    this.logged_user = this._authService.UserInfo;
    this.districts = this._masterService.getDistrictAll();
    this.taluks = this._masterService.getTalukAll();
    this.StudentId = 0;

  }

  onSelect(type) {
    let districtSelection = [];
    let talukSelection = [];
    switch (type) {
      case 'D':
        this.districts.forEach(d => {
          districtSelection.push({ label: d.name, value: d.code });
        })
        this.districtOptions = districtSelection;
        this.districtOptions.unshift({ label: '-select', value: null });
        break;
      case 'T':
        this.taluks.forEach(t => {
          if (t.dcode === this.district) {
            talukSelection.push({ label: t.name, value: t.code });
          }
        })
        this.talukOptions = talukSelection;
        this.talukOptions.unshift({ label: '-select', value: null });
        break;
    }
  }

  selectHostel() {
    this.hostel = null;
    this.hostelOptions = [];
    let hostelSelection = [];
    if (this.district !== undefined && this.district !== null && this.taluk !== undefined && this.taluk !== null) {
      const params = {
        'Type': 1,
        'DCode': this.district,
        'TCode': this.taluk,
        'HostelId': 0
        
      }
      if (this.district !== null && this.district !== undefined) {
        this._restApiService.getByParameters(PathConstants.Hostel_Get, params).subscribe(res => {
          if (res !== null && res !== undefined && res.length !== 0) {
            this.hostels = res.Table;
            this.hostels.forEach(h => {
              hostelSelection.push({ label: h.HostelName, value: h.Slno });
            })
            this.hostelOptions = hostelSelection;
            this.hostelOptions.unshift({ label: '-select', value: null });
          };
        })
      }
    }
  }

  onSubmit() {
    const params = {
      'Id': this.StudentId,
      'DCode': this.district,
      'TCode': this.taluk,
      'HCode': this.hostel,
      'Aadharno': this.aadharNo,
      'Name': this.studentName,
      'EmailId': this.email,
      'Flag': 1
    }
    this._restApiService.post(PathConstants.StudentRegistration_Post, params).subscribe(res => {
      if (res) {
        // this.clearform();
        this._messageService.clear();
        this._messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_SUCCESS,
          summary: ResponseMessage.SUMMARY_SUCCESS, detail: ResponseMessage.SubmitMessage
        });
      } else {
        this._messageService.clear();
        this._messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
          summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.ErrorMessage
        });
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
    const parameter = {
      'Id': this.userMasterId,
      'Districtcode': this.district,
      'HostelID': this.hostel,
      'Talukid': this.taluk,
      'UserName': this.studentName,
      'EMailId': this.email,
      'RoleId': 5,
      'Pwd': 12345,
      'Flag': 1,
    }
    this._restApiService.post(PathConstants.UserMaster_Post, parameter).subscribe(res => {
      if (res) {
        this.clearForm();
        this._messageService.clear();
        this._messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_SUCCESS,
          summary: ResponseMessage.SUMMARY_SUCCESS, detail: ResponseMessage.SuccessMessage
        });
      } else {
        this._messageService.clear();
        this._messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
          summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.ErrorMessage
        });
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

  refreshFields(value) {
    if (value === 'D') {
      this.taluk = null;
      this.talukOptions = [];
    }
    this.selectHostel();
  }

  loadStudentsData() {
    const params = {
      'DCode': this.district,
      'TCode': this.taluk,
      'HCode': this.hostel
    }
    this._restApiService.getByParameters(PathConstants.Registration_Get, params).subscribe(res => {
      if (res !== undefined && res !== null && res.length !== 0) {
        this.StudentsData = res;
        console.log('rs', this.StudentsData)
      } else {
        this._messageService.clear();
        this._messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_WARNING,
          summary: ResponseMessage.SUMMARY_WARNING, detail: ResponseMessage.NoRecordMessage
        })
      }
    })
    this.onView();
  }

  onAadharChange() {
    this.studentName = '';
    this.email = '';
  }

  onSearch() {
    var isExists = false;
    if (this.StudentsData.length !== 0) {
      if (this.aadharNo.length > 11) {
        //forloop
        for (let i = 0; i < this.StudentsData.length; i++) {
          if (this.StudentsData[i].aadharNo === this.aadharNo) {
            this.enableField = true;
            isExists = true;
            this.studentName = this.StudentsData[i].studentName;
            break; //break the loop
          } else {
            isExists = false;
            continue;  //continuing the loop
          }
        }
        if (!isExists) {
          this._messageService.clear();
          this._messageService.add({
            key: 't-msg', severity: ResponseMessage.SEVERITY_WARNING,
            summary: ResponseMessage.SUMMARY_WARNING, detail: ResponseMessage.AadharMsg
          })
        }
      }
    }
    this.checkRegistrationExists();
  }

  checkRegistrationExists() {
    var isExists = false;
    if (this.feedbackRegData.length !== 0) {
      if (this.aadharNo.length > 11) {
        //forloop
        for (let i = 0; i < this.feedbackRegData.length; i++) {
          if (this.feedbackRegData[i].aadharNo === this.aadharNo) {
            isExists = true;
            this.studentName = this.feedbackRegData[i].studentName;
            this._messageService.clear();
            this._messageService.add({
              key: 't-msg', severity: ResponseMessage.SEVERITY_WARNING,
              summary: ResponseMessage.SUMMARY_WARNING, detail: ResponseMessage.SuccessMessage
            })
            break; //break the loop
          } else {
            isExists = false;
            continue;  //continuing the loop
          }
        }
      }
    }
  }

  onView() {
    this._restApiService.get(PathConstants.UserMaster_Get).subscribe(res => {
      if (res !== null && res !== undefined && res.Table.length !== 0) {
        this.userData = res.Table;
      }
    })
    // this._restApiService.get(PathConstants.StudentRegistration_Get).subscribe(r => {
    //   if (r) {
    //     this.feedbackRegData = r;
    //   }
    // })
  }

  checkIfEmailExists() {
    if (this.email !== undefined && this.email !== null && this.email.trim() !== '' &&
      this.userData.length !== 0) {
      this.checkEmail = true;
      const entered_email: string = this.email.trim();
      const substr = entered_email.split('@');
      if (substr !== undefined && substr.length > 1) {
        const last_str = substr[1].split('.');
        if (last_str !== undefined && last_str.length > 1) {
          if (last_str[1].toLowerCase() === 'com' || last_str[1].toLowerCase() === 'in') {
            this.userData.forEach(i => {
              const email: string = i.EMailId;
              if (email.trim() === entered_email) {
                this._messageService.clear();
                this._messageService.add({
                  key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR, life: 2000,
                  summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.EmailAlreadyExists
                })
                this.checkEmail = false;
                this.email = '';
              } else {
                this.checkEmail = false;
              }
            })
          }
        }
      }
    }
  }
  clearForm() {
    this._studentFeedback.reset();
  }
}


