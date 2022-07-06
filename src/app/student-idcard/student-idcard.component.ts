import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { window } from 'rxjs';
import { ResponseMessage } from '../Common-Modules/messages';
import { PathConstants } from '../Common-Modules/PathConstants';
import { TableConstants } from '../Common-Modules/table-constants';
import { AuthService } from '../services/auth.service';
import { MasterService } from '../services/master-data.service';
import { RestAPIService } from '../services/restAPI.service';

@Component({
  selector: 'app-student-idcard',
  templateUrl: './student-idcard.component.html',
  styleUrls: ['./student-idcard.component.css']
})
export class StudentIdcardComponent implements OnInit {

  district: any;
  districtOptions: SelectItem[];
  taluk: any;
  talukOptions: SelectItem[];
  hostelName: any;
  hostelOptions: SelectItem[];
  studentData: any[] = [];
  studentDataCols: any;
  districts?: any;
  taluks?: any;
  logged_user: any;
  hostels?: any;
  loading: boolean;
  academicYear: any;
  emisNo: any;
  studentName: any;
  hostel: any
  class: any;
  BloodGroup: any;
  showReceipt: boolean;
  studentImage: string;
  dob: any;
  institutionName: any;
  address: any;
  medium: any;
  mobNo: any;
  course: any;

  constructor(private _tableConstants: TableConstants, private masterService: MasterService, private _authService: AuthService,
    private restApiService: RestAPIService, private _messageService: MessageService, private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.studentDataCols = this._tableConstants.studentIdcardColumns;
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
    this.loadHostelList();
  }

  loadTable() {
    this.studentData = [];
    if (this.district !== null && this.district !== undefined && this.taluk !== null && this.taluk !== undefined &&
      this.hostelName !== null && this.hostelName !== undefined) {
      this.loading = true;
      const params = {
        'DCode': this.district,
        'TCode': this.taluk,
        'HCode': this.hostelName,
      }
      this.restApiService.getByParameters(PathConstants.Registration_Get, params).subscribe(res => {
        if (res !== undefined && res !== null && res.length !== 0) {
          res.forEach(r => {
            r.dob = this.datePipe.transform(r.dob, 'MM/dd/yyyy')
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
  onEdit(row) {
    this.onGenerate(row);
  }

  onGenerate(data) {
    this.studentName = data.studentName;
    this.academicYear = data.Class;
    this.BloodGroup = data.bloodgroupName;
    this.class = data.class;
    this.emisNo = data.emisno;
    this.hostel = data.HostelName;
    this.dob = data.dob;
    this.institutionName = data.instituteName;
    this.address = data.instituteDName;
    this.medium = data.mediumName;
    this.mobNo = data.mobileNo;
    this.course = data.courseTitle;
    this.studentImage = (data.studentFilename !== undefined && data.studentFilename !== null) ? (data.studentFilename.trim() !== '' ? ('../../assets/layout/' + data.hostelId + '/Documents/' + data.studentFilename) : '') : '';
    this.showReceipt = true;
  }

  onClose() {
    this.studentName = '';
    this.hostel = '';
    this.academicYear = '';
    this.hostel = '';
    this.emisNo = '';
    this.class = '';
    this.showReceipt = false;
  }

}
