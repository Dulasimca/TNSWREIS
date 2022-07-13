import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { BooleanLiteral } from 'typescript';
import { ResponseMessage } from '../Common-Modules/messages';
import { PathConstants } from '../Common-Modules/PathConstants';
import { TableConstants } from '../Common-Modules/table-constants';
import { User } from '../interfaces/user';
import { AuthService } from '../services/auth.service';
import { MasterService } from '../services/master-data.service';
import { RestAPIService } from '../services/restAPI.service';

@Component({
  selector: 'app-online-registered-student-report',
  templateUrl: './online-registered-student-report.component.html',
  styleUrls: ['./online-registered-student-report.component.css']
})
export class OnlineRegisteredStudentReportComponent implements OnInit {

  district: any;
  districtOptions: SelectItem[];
  talukOptions: SelectItem[];
  taluk: any;
  hostel: any;
  hostelOptions: SelectItem[];
  disableExcel: boolean;
  studentCols: any;
  districts?: any;
  taluks?: any;
  logged_user: User;
  roleId: any;
  hostels?: any;
  studentData: any = [];
  loading: boolean;

  constructor(private _masterService: MasterService, private _restApiService: RestAPIService, private _tableConstants: TableConstants,
    private _messageService: MessageService, private _authService: AuthService, private _datePipe: DatePipe) { }

  ngOnInit(): void {
    this.studentCols = this._tableConstants.OnlineRegisteredStudentColumns;
    this.districts = this._masterService.getMaster('DT');
    this.taluks = this._masterService.getMaster('TK');
    this.logged_user = this._authService.UserInfo;
    this.roleId = (this.logged_user.roleId * 1);
    // this.items = [
    //   {'header': 'Approved'},
    //   {'header': 'Disapproved'}
    // ]
  }

  onSelect(type) {
    let districtSelection = [];
    let talukSelection = [];
    if (this.roleId !== undefined && this.roleId !== null) {
      switch (type) {
        case 'D':
          this.districts.forEach(d => {
            districtSelection.push({ label: d.name, value: d.code });
          })
          this.districtOptions = districtSelection;
          if ((this.logged_user.roleId * 1) === 1) {
            this.districtOptions.unshift({ label: 'All', value: 0 });
          }
          this.districtOptions.unshift({ label: '-select-', value: null });
          break;
        case 'T':
          this.taluks.forEach(t => {
            if (t.dcode === this.district) {
              talukSelection.push({ label: t.name, value: t.code });
            }
          })
          this.talukOptions = talukSelection;
          if ((this.logged_user.roleId * 1) === 1 || (this.logged_user.roleId * 1) === 2) {
            this.talukOptions.unshift({ label: 'All', value: 0 });
          }
          this.talukOptions.unshift({ label: '-select-', value: null });
          break;
      }
    }
  }

  reloadFields(value) {
    if (value === 'D') {
      this.taluk = null;
      this.talukOptions = [];
    }
    this.loadHostelList();
  }

  loadHostelList() {
    this.hostel = null;
    this.hostelOptions = [];
    let hostelSelection = [];
    const params = {
      'Type': 0,
      'DCode': this.district,
      'TCode': this.taluk,
      'HostelId': (this.logged_user.hostelId !== undefined && this.logged_user.hostelId !== null) ?
        this.logged_user.hostelId : 0,
    }
    if (this.district !== null && this.district !== undefined && this.district !== 'All' &&
      this.taluk !== null && this.taluk !== undefined && this.taluk !== 'All') {
      this._restApiService.getByParameters(PathConstants.Hostel_Get, params).subscribe(res => {
        if (res !== null && res !== undefined && res.length !== 0) {
          this.hostels = res.Table;
          this.hostels.forEach(h => {
            if(h.Talukid === this.taluk)
            hostelSelection.push({ label: h.HostelName, value: h.Slno });
          })
        }
      })
    }
    this.hostelOptions = hostelSelection;
    if ((this.logged_user.roleId * 1) !== 4) {
      this.hostelOptions.unshift({ label: 'All', value: 0 });
    }
    this.hostelOptions.unshift({ label: '-select-', value: null });
  }

  loadTable() {
    this.studentData = [];
    if (this.district !== null && this.district !== undefined && this.taluk !== null && this.taluk !== undefined &&
      this.hostel !== null && this.hostel !== undefined && this.hostel !== undefined) {
      this.loading = true;
      const params = {
        'DCode': this.district,
        'TCode': this.taluk,
        'HCode': this.hostel,
        'Roleid': this.logged_user.roleId
      }
      this._restApiService.getByParameters(PathConstants.OnlineRegisteredStudent_Get, params).subscribe(res => {
        if (res !== undefined && res !== null && res.length !== 0) {
          res.forEach(r => {
            r.isNewStudent = (r.isNewStudent === 1) ? 'Old Student' : 'New Student'
            if (r.wardenApproval === 1) {
              r.wardenApproval = 'Confirmed !';
            } else if (r.wardenApproval === 2) {
              r.wardenApproval = 'Rejected';
            } else {
              r.wardenApproval = 'Pending !';
            }
            if (r.districtApproval === 1) {
              r.districtApproval = 'Confirmed !';
            } else if (r.districtApproval === 2) {
              r.districtApproval = 'Rejected';
            } else {
              r.districtApproval = 'Pending !';
            }
          })
          this.studentData = res;
          this.loading = false;
          
        } else {
          this.loading = false;
          this._messageService.clear();
          this._messageService.add({
            key: 't-msg', severity: ResponseMessage.SEVERITY_WARNING,
            summary: ResponseMessage.SUMMARY_WARNING, detail: ResponseMessage.NoRecForCombination
          })

        }

      })
    }
  }
}
