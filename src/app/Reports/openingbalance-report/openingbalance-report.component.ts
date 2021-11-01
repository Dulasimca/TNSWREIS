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
  selector: 'app-openingbalance-report',
  templateUrl: './openingbalance-report.component.html',
  styleUrls: ['./openingbalance-report.component.css']
})
export class OpeningbalanceReportComponent implements OnInit {

  district: any;
  taluk: any;
  hostelName: any;
  openingData: any[] = [];
  openingCols: any[] = [];
  districtOptions: SelectItem[];
  talukOptions: SelectItem[];
  hostelOptions: SelectItem[];
  yearOptions: SelectItem[];
  yearRange: string;
  accYear: any;
  districts?: any;
  taluks?: any;
  hostels?: any;
  years?: any;
  loading: boolean;
  logged_user: User;
  totalRecords: number;

  constructor(private masterService: MasterService, private restApiService: RestAPIService, private _tableConstants: TableConstants,
    private _messageService: MessageService, private _authService: AuthService, private _datePipe: DatePipe) { }

  ngOnInit(): void {
    this.openingCols = this._tableConstants.openingBalanceReportColumns;
    const current_year = new Date().getFullYear();
    const start_year_range = current_year - 30;
    this.yearRange = start_year_range + ':' + current_year;
    this.districts = this.masterService.getMaster('DT');
    this.taluks = this.masterService.getMaster('TK');
    this.years = this.masterService.getMaster('AY')
    this.logged_user = this._authService.UserInfo;
  }

  onSelect(type) {
    let districtSelection = [];
    let talukSelection = [];
    let yearSelection = [];
    if(this.logged_user.roleId !== undefined && this.logged_user.roleId !== null) {
      switch(type) {
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
        this.changeDistrict();
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
        case 'Y':
          this.years.forEach(y => {
            yearSelection.push({ label: y.name, value: y.code });
          })
          this.yearOptions = yearSelection;
          this.yearOptions.unshift({ label: 'All', value: 0});
          this.yearOptions.unshift({ label: '-select', value: null });
          break;
      
    }
  }
}
  changeDistrict() {
    let hostelSelection = [];
    const params = {
      'Type' : 1,
      'Value': this.district
    }
    if (this.district !== null && this.district !== undefined && this.district !== 'All') {
      this.restApiService.getByParameters(PathConstants.Hostel_Get, params).subscribe(res => {
        if (res !== null && res !== undefined && res.length !== 0) {
          this.hostels = res.Table;
            this.hostels.forEach(h => {
              hostelSelection.push({ label: h.HostelName, value: h.Slno });
            })
        }
      })
    }
      console.log('sel', this.hostelOptions, hostelSelection)
      this.hostelOptions = hostelSelection;
      this.hostelOptions.unshift({ label: 'All', value: 0 });
      this.hostelOptions.unshift({ label: '-select-', value: 'null' });
    }
    loadTable() {
     // this.changeDistrict();
      this.openingData = [];
      if(this.district !== null && this.district !== undefined && this.taluk !==null && this.taluk !==undefined &&
        this.hostelName !== null && this.hostelName !== undefined && this.accYear !== null && this.hostelName !==undefined 
        ){
      this.loading = true;
      const params = {
        'Districtcode': this.district,
        'Talukid': this.taluk,
        'HostelId': this.hostelName,
        'AccYear': this._datePipe.transform(this.accYear, 'MM/dd/yyyy'),
      }
      this.restApiService.post( '', params).subscribe(res => {
        if (res !== undefined && res !== null && res.Table.length !== 0) {
          res.Table.forEach(r => {
            r.AccYear = this._datePipe.transform(r.AccYear, 'MM/dd/yyyy');
          })
          this.openingData = res.Table;
          this.totalRecords = this.openingData.length;
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

