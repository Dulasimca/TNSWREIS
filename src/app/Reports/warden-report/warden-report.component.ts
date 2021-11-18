import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
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
  district: any;
  talukOptions: SelectItem[];
  taluk: any;
  statusOptions: SelectItem[];
  status: any;
  wardenDetailsCols: any;
  wardenDetails: any[] = [];
  wardenDetailsAll: any[] = [];
  loading: boolean;
  totalRecords: number;
  districts?: any;
  taluks?: any;
  logged_user: User;
  show: boolean;
  wardenName: any;
  endDate: any;
  joinDate: any;
  wardenId: number;
  
  constructor(private _tableConstants: TableConstants, private _restApiService: RestAPIService,
    private _messageService: MessageService, private _authService: AuthService, 
    private _masterService: MasterService, private _datePipe: DatePipe) { }

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
        this.districtOptions.unshift( {label: 'All', value: 0});
        this.districtOptions.unshift( {label: '-select-', value: 'null'});

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
        this.talukOptions.unshift({ label: 'All', value: 0});
        this.talukOptions.unshift( {label: '-select-', value: 'null'});
        break;
      }
    }
  }
  loadTable() {
    this.wardenDetailsAll = [];
    if(this.district !== undefined && this.district !== null && this.taluk !== undefined && 
      this.taluk !== null){
    this.loading = true;
    const params = {
      'Districtcode': this.district,
      'Talukid': this.taluk
    }
    this._restApiService.post(PathConstants.WardenDetails_Report_Post, params).subscribe(res => {
      if (res.Table !== undefined && res.Table !== null && res.Table.length !== 0) {
        console.log('true')
        res.Table.forEach(r => {
          r.HostelJoinedDate = this._datePipe.transform(r.HostelJoinedDate, 'yyyy-MM-dd');
          r.ServiceJoinedDate = this._datePipe.transform(r.ServiceJoinedDate, 'yyyy-MM-dd');
          r.EndDate = (r.EndDate !== null) ? this._datePipe.transform(r.EndDate, 'yyyy-MM-dd') : null;
        })
        this.wardenDetails = res.Table;
        this.wardenDetailsAll = res.Table;
        this.loading = false;
      } else {
        console.log('false')
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
  filterTable() {
    if (this.wardenDetailsAll.length !== 0 && this.status !== undefined && this.status !== null) {
      if (this.status === 1) {
        this.wardenDetails = this.wardenDetailsAll.filter(f => {
          return f.Flag;
        })
      } else if (this.status === 2) {
        this.wardenDetails = this.wardenDetailsAll.filter(f => {
          return !f.Flag;
        })
      } else {
        this.wardenDetails = this.wardenDetailsAll;
      }
    }
  }
onEdit(row) {
 this.show = true;
 this.wardenName = row.WardenName;
 this.joinDate = row.HostelJoinedDate;
 this.wardenId = row.WardenId;  
}
 onSubmit() {
   const params = {
     'WardenId': this.wardenId,
     'EndDate':  this._datePipe.transform(this.endDate, 'yyyy-MM-dd'),
   }
   this._restApiService.put(PathConstants.Warden_Put, params).subscribe(res => {
         if (res !== undefined && res !== null && res.length !== 0) {
           this.loadTable();
           this._messageService.clear();
           this._messageService.add({
             key: 't-msg', severity: ResponseMessage.SEVERITY_SUCCESS,
             summary: ResponseMessage.SUMMARY_SUCCESS, detail: ResponseMessage.SuccessMessage
           });
           this.endDate = '';
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
}
  
   
 


