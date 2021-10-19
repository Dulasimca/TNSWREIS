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
  selector: 'app-warden-report',
  templateUrl: './warden-report.component.html',
  styleUrls: ['./warden-report.component.css']
})
export class WardenReportComponent implements OnInit {
  districtOptions: SelectItem[];
  district: number;
  talukOptions: SelectItem[];
  taluk: number;
  statusOptions: SelectItem[];
  status: number;
  wardenDetailsCols: any;
  wardenDetails: any[] = [];
  wardenDetailsAll: any[] = [];
  loading: boolean;
  totalRecords: number;
  districts?: any;
  taluks?: any;
  logged_user: User;
  constructor(private _tableConstants: TableConstants, private _restApiService: RestAPIService,
    private _messageService: MessageService, private _authService: AuthService, private _masterService: MasterService) { }

  ngOnInit(): void {
    this.wardenDetailsCols = this._tableConstants.wardenDetailsReportColumns;
    this.districts = this._masterService.getMaster('DT');
    this.taluks = this._masterService.getMaster('TK');
    this.logged_user = this._authService.UserInfo;
    this.statusOptions = [
      { label: '-select-', value: null},
      { label: 'All', value: 0 },
      { label: 'Active', value: 1 },
      { label: 'InActive', value: 2 }
    ]
  }

  onSelect(value) {
    let districtSelection = [];
    let talukSelection = [];
    if(this.logged_user.roleId !== undefined && this.logged_user.roleId !== null) {
      switch(value) {
      case 'D':
        var filtered_districts = [];
        if((this.logged_user.roleId * 1) === 2 || (this.logged_user.roleId * 1) === 3) {
          filtered_districts = this.districts.filter(f => {
            return f.code === this.logged_user.districtCode;
          })
        } else {
          filtered_districts = this.districts.slice(0);
        }
        filtered_districts.forEach(d => {
          districtSelection.push({ label: d.name, value:d.code });
        })
        this.districtOptions = districtSelection;
        this.districtOptions.unshift( {label: '-select-', value: null});
        break;
      case 'T':
        var filtered_taluks = [];
        if((this.logged_user.roleId * 1) === 3) {
          filtered_taluks = this.taluks.filter(f => {
            return f.code === this.logged_user.talukId;
          })
        } else {
          filtered_taluks = this.taluks.slice(0);
        }
        filtered_taluks.forEach(t => {
          if (t.dcode === this.district) {
            talukSelection.push({ label: t.name, value: t.code });
          }
        })
        this.talukOptions = talukSelection;
        this.talukOptions.unshift({ label: '-select-', value: null});
        break;
      }
    }
  }

  loadTable() {
    this.wardenDetailsAll = [];
    this.loading = true;
    const params = {
      'DCode': this.district,
      'TCode': this.taluk
    }
    this._restApiService.getByParameters(PathConstants.WardenDetails_Report_Get, params).subscribe(res => {
      if (res !== undefined && res !== null && res.length !== 0) {
        this.wardenDetailsAll = res.slice(0);
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

  filterTable() {
    if (this.wardenDetailsAll.length !== 0 && this.status !== undefined && this.status !== null) {
      if (this.status === 1) {
        this.wardenDetails = this.wardenDetailsAll.filter(f => {
          return f.Flag === 1;
        })
      } else if (this.status === 2) {
        this.wardenDetails = this.wardenDetailsAll.filter(f => {
          return f.Flag === 0;
        })
      } else {
        this.wardenDetails = this.wardenDetailsAll;
      }
    }
  }
onEdit(row) {

}
}
