import { Component, OnInit } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { ResponseMessage } from '../Common-Modules/messages';
import { PathConstants } from '../Common-Modules/PathConstants';
import { TableConstants } from '../Common-Modules/table-constants';
import { User } from '../interfaces/user';
import { AuthService } from '../services/auth.service';
import { MasterService } from '../services/master-data.service';
import { RestAPIService } from '../services/restAPI.service';

@Component({
  selector: 'app-online-registered-studentstatus',
  templateUrl: './online-registered-studentstatus.component.html',
  styleUrls: ['./online-registered-studentstatus.component.css']
})
export class OnlineRegisteredStudentstatusComponent implements OnInit {

  district: any;
  taluk: any;
  hostelName: any;
  districtOptions: SelectItem[];
  talukOptions: SelectItem[];
  hostelOptions: SelectItem[];
  StudentDetails: any = [];
  studentCols: any;
  disableExcel: boolean = true;
  loading: boolean;
  districts?: any;
  taluks?: any;
  logged_user: User;
  hostels?: any;


  constructor(private _tableConstants: TableConstants, private masterService: MasterService, private _authService: AuthService,
    private restApiService: RestAPIService, private _messageService: MessageService) { }

  ngOnInit(): void {
    this.studentCols = this._tableConstants.OnlineRegisteredStudentColumns;
    this.districts = this.masterService.getMaster('DT');
    this.taluks = this.masterService.getMaster('TK');
    this.logged_user = this._authService.UserInfo;
  }

  onSelect(value) {
    let districtSelection = [];
    let talukSelection = [];
    if (this.logged_user.roleId !== undefined && this.logged_user.roleId !== null) {
      switch (value) {
        case 'D':
          this.districts.forEach(d => {
            districtSelection.push({ label: d.name, value: d.code });
          })
          this.districtOptions = districtSelection;
          if ((this.logged_user.roleId * 1) === 1) {
            this.districtOptions.unshift({ label: 'All', value: 0 });
          }
          this.districtOptions.unshift({ label: '-select-', value: 'null' });
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
          this.talukOptions.unshift({ label: '-select-', value: 'null' });
          break;

      }
    }
  }

  loadHostelList() {
    let hostelSelection = [];
    const params = {
      'Type': 0,
      'DCode': this.district,
      'TCode': this.taluk,
      'HostelId': ((this.logged_user.roleId * 1) === 4) ? this.logged_user.hostelId : 0
    }
    if (this.district !== null && this.district !== undefined && this.district !== 'All' &&
      this.taluk !== null && this.taluk !== undefined) {
      this.restApiService.getByParameters(PathConstants.Hostel_Get, params).subscribe(res => {
        if (res !== null && res !== undefined && res.length !== 0) {
          this.hostels = res.Table;
          this.hostels.forEach(h => {
            if (h.Talukid === this.taluk)
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

  refreshFields(value) {
    if (value === 'D') {
      this.taluk = null;
      this.talukOptions = [];
    }
    if (value === 'T') {
      this.hostelName = null;
      this.hostelOptions = [];
    }
    this.loadHostelList();
  }

  onClick(data, value) {
    this.loading = true;
    if (value === 0) {
      ///Active
      this.StudentDetails.forEach(i => {
        if (i.Flag === data.Flag)
          i.Flag = 0; //active to inactive
        this.loading = false;
      })
    } else {
      ///inactive
      this.StudentDetails.forEach(i => {
        if (i.Flag === data.Flag)
          i.Flag = 1; // inactive to active
        this.loading = false;
      })
    }
    const params = {
      'StudentId': data.studentId,
      'Flag': (data.Flag) ? 1 : 0,
    }
    this.restApiService.post(PathConstants.UpdateOnlineRegistrationStatus_Put, params).subscribe(res => {
      if (res) {
        this._messageService.clear();
        this._messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_SUCCESS,
          summary: ResponseMessage.SUMMARY_SUCCESS, detail: ResponseMessage.UpdateMsg
        });
      } else {
        this._messageService.clear();
        this._messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
          summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.ErrorMessage
        });
      }
    })
  }

  loadTable() {
    this.disableExcel =true;
    this.StudentDetails = [];
    if (this.district !== null && this.district !== undefined && this.taluk !== null && this.taluk !== undefined &&
      this.hostelName !== null && this.hostelName !== undefined && this.hostelName !== undefined) {
      this.loading = true;
      const params = {
        'DCode': this.district,
        'TCode': this.taluk,
        'HCode': this.hostelName,
        'Roleid': this.logged_user.roleId
      }
      this.restApiService.getByParameters(PathConstants.OnlineRegisteredStudentforHO_Get, params).subscribe(res => {
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
          this.StudentDetails = res;
          this.disableExcel = false
          this.loading = false;

        } else {
          this.disableExcel = true;
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
