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
  selector: 'app-student-details',
  templateUrl: './student-details.component.html',
  styleUrls: ['./student-details.component.css']
})
export class StudentDetailsComponent implements OnInit {

  district: any;
  taluk: any;
  hostelName: any;
  studentData: any[] = [];
  studentCols: any;
  districtOptions: SelectItem[];
  talukOptions: SelectItem[];
  hostelOptions: SelectItem[];
  districts?: any;
  taluks?: any;
  hostels?: any;
  logged_user: User;
  loading: boolean;
  constructor(private masterService: MasterService, private restApiService: RestAPIService, private _tableConstants: TableConstants,
    private _messageService: MessageService, private _authService: AuthService, private _datePipe: DatePipe) { }

  ngOnInit(): void {
    this.studentCols = this._tableConstants.registrationColumns;
    this.districts = this.masterService.getMaster('DT');
    this.taluks = this.masterService.getMaster('TK');
    this.logged_user = this._authService.UserInfo;
  }

  onSelect(type) {
    let districtSelection = [];
    let talukSelection = [];
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
      this.studentData = [];
      if(this.district !== null && this.district !== undefined && this.taluk !==null && this.taluk !==undefined &&
        this.hostelName !== null && this.hostelName !== undefined && this.hostelName !==undefined ){
      this.loading = true;
      const params = {
        'DCode': this.district,
        'TCode': this.taluk,
        'HCode': this.hostelName 
      }
      this.restApiService.post(PathConstants.Registration_Get, params).subscribe(res => {
        if (res.Table !== undefined && res.Table !== null && res.Table.length !== 0) {
          this.studentData = res.Table;
          this.loading = false;
          console.log('true')
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
