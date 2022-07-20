import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { ResponseMessage } from 'src/app/Common-Modules/messages';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { TableConstants } from 'src/app/Common-Modules/table-constants';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { MasterService } from 'src/app/services/master-data.service';
import { RestAPIService } from 'src/app/services/restAPI.service';

@Component({
  selector: 'app-employee-vacany-details',
  templateUrl: './employee-vacany-details.component.html',
  styleUrls: ['./employee-vacany-details.component.css']
})
export class EmployeeVacanyDetailsComponent implements OnInit {

  district: any;
  taluk: any;
  hostelName: any;
  districtOptions: SelectItem[];
  talukOptions: SelectItem[];
  hostelOptions: SelectItem[];
  disableExcel: boolean;
  loading: boolean;
  EmployeeDetails: any = [];
  EmployeeCols: any;
  districts?: any;
  taluks?: any;
  hostels?: any;
  logged_user: User;

  constructor(private _tableConstants: TableConstants, private masterService: MasterService, private _authService: AuthService,
    private restApiService: RestAPIService,private _messageService: MessageService, private _datepipe: DatePipe) { }

  ngOnInit(): void {
    this.EmployeeCols = this._tableConstants.EmployeeVacancyDetailcolumns;
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

  loadTable() {
    this.disableExcel =true;
    this.EmployeeDetails = [];
    if (this.district !== null && this.district !== undefined && this.taluk !== null && this.taluk !== undefined &&
      this.hostelName !== null && this.hostelName !== undefined && this.hostelName !== undefined) {
      this.loading = true;
      const params = {
        'DCode': this.district,
        'TCode': this.taluk,
        'HCode': this.hostelName,
      }
      this.restApiService.getByParameters(PathConstants.EmployeeVacancy_Get, params).subscribe(res => {
        if (res !== undefined && res !== null) {
          if(res.length !== 0){
            res.forEach(r => {
              r.VacantFormattedDate = this._datepipe.transform(r.VacantDate, 'dd-MM-yyyy');
            })
          this.EmployeeDetails = res;
          this.disableExcel = false
          this.loading = false;

        } 
        else {
          this.disableExcel = true;
          this.loading = false;
          this._messageService.clear();
          this._messageService.add({
            key: 't-msg', severity: ResponseMessage.SEVERITY_WARNING,
            summary: ResponseMessage.SUMMARY_WARNING, detail: ResponseMessage.NoRecForCombination
          })
        }
      }else {
          this.disableExcel = true;
          this.loading = false;
          this._messageService.clear();
          this._messageService.add({
            key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
            summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.ErrorMessage
          })

        }

      })
    }
  }
}
