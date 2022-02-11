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
  @ViewChild('f', { static: false }) _studentFeedback: NgForm;
  enableField: boolean;

  constructor(private _authService: AuthService, private _restApiService: RestAPIService, private _masterService: MasterService,
    private _messageService: MessageService) { }

  ngOnInit(): void {
    const current_year = new Date().getFullYear();
    const start_year_range = current_year - 30;
    this.yearRange = start_year_range + ':' + current_year;
    this.logged_user = this._authService.UserInfo;
    this.districts = this._masterService.getMaster('DT');
    this.taluks = this._masterService.getMaster('TK');

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
  onSubmit() {

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
        'HostelId': (this.logged_user.hostelId !== undefined && this.logged_user.hostelId !== null) ?
          this.logged_user.hostelId : 0,
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
            console.log('gh')
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
  }
}


