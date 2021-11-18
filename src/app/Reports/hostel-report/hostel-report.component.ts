import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { HttpClient  } from '@angular/common/http';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { RestAPIService } from 'src/app/services/restAPI.service';
import { MasterService } from 'src/app/services/master-data.service';
import { NgForm } from '@angular/forms';
import { ResponseMessage } from 'src/app/Common-Modules/messages';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { TableConstants } from 'src/app/Common-Modules/table-constants';

@Component({
  selector: 'app-hostel-report',
  templateUrl: './hostel-report.component.html',
  styleUrls: ['./hostel-report.component.css']
})
export class HostelReportComponent implements OnInit {
  hostel: any;
  district: any;
  taluk: any;
  HostelId : number
  Hosteltamilname: string;
  Hosteltype: number;
  Hosteltypes?: any;
  talukOptions: SelectItem[];
  districtOptions: SelectItem[];
  DistrictId : number 
  Districtcode: number;
  Districtcodes?: any;
  TalukId: number;
  TalukIds?: any;
  hostelOptions: SelectItem[];
  Buildingno: any;
  Street: any;
  Landmark: string;
  upload: any;
  pincode: any;
  Longitude: any;
  Latitude: any;
  Radius: any;
  Totalstudent: any;
  mobileNo: any;
  daysOptions: SelectItem[];
  disableTaluk: boolean = true;
  masterData?: any = [];
  days?: any = [];
  data: any = [];
  Table2?: any;
  Slno: any;
  cols: any;
  login_user: User;
  districts? : any;
  taluks?: any;
  hostels?: any;
  role: number;
  isDistrict : boolean;
  isTaluk:boolean;
  isHostel:boolean;
  hostelCols: any;
  hostelDetails: any = [];
  hostelData: any = [];
  loading: boolean;
  constructor(private http: HttpClient, private restApiService: RestAPIService,
    private masterService: MasterService,private _authService: AuthService,
    private _messageService: MessageService, private tableConstants: TableConstants) { }

  ngOnInit(): void {
    this.hostelCols = this.tableConstants.hostelReportCols
     this.Slno = 0;
     this.login_user = this._authService.UserInfo;
     this.districts = this.masterService.getMaster('DT');
     this.taluks = this.masterService.getMaster('TK');
    //  this.districtname = this.login_user.districtName;
    //  this.talukname = this.login_user.talukName;
    //  this.hostelname=this.login_user.hostelName;
    // this.role=this.login_user.roleId;
      
  }
  onSelect(type) {
    let districtSelection = [];
    let talukSelection = [];
    if(this.login_user.roleId !== undefined && this.login_user.roleId !== null) {
      switch(type) {
      case 'D':
        var filtered_districts = [];
        if((this.login_user.roleId * 1) === 2 || (this.login_user.roleId * 1) === 3) {
          filtered_districts = this.districts.filter(f => {
            return f.code === this.login_user.districtCode;
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
        if((this.login_user.roleId * 1) === 3) {
          filtered_taluks = this.taluks.filter(f => {
            return f.code === this.login_user.talukId;
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
       this.hostelDetails = [];
       if(this.district !== null && this.district !== undefined && this.taluk !==null && this.taluk !==undefined &&
         this.hostel !== null && this.hostel !== undefined && this.hostel !==undefined ){
       this.loading = true;
       const params = {
         'DCode': this.district,
         'TCode': this.taluk,
         'HCode': this.hostel,
       }
       this.restApiService.post(PathConstants.HostelDetails_Report_Post, params).subscribe(res => {
        if (res.Table !== undefined && res.Table !== null && res.Table.length !== 0) {
          console.log('true',res)

           this.hostelData = res.Table;
           this.hostelDetails = res.Table;
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
  // onview() {
  //   const params = {
  //     'sType':'0',
  //     'HostelId': this.hostelname != undefined && this.hostelname != null ? this.hostelname : 0,	
  //   }
    
  //   this.restApiService.getByParameters(PathConstants.Hostel_Get, params).subscribe(res => {
  //     if (res !== null && res !== undefined && res.length !== 0) {
  //       this.data = res.Table;
  //       console.log(this.data);
  //     }

  //   });

  // }
  
         
  

}
