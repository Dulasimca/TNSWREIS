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

@Component({
  selector: 'app-hostel-report',
  templateUrl: './hostel-report.component.html',
  styleUrls: ['./hostel-report.component.css']
})
export class HostelReportComponent implements OnInit {
  hostelname: string;
  districtname: string;
  talukname: string;
  HostelId : number
  Hosteltamilname: string;
  Hosteltype: number;
  Hosteltypes?: any;
  HosteltypeOptions: SelectItem[];
  DistrictcodeOptions: SelectItem[];
  DistrictId : number 
  Districtcode: number;
  Districtcodes?: any;
  taluks : any;
  TalukId: number;
  TalukIds?: any;
  TalukIdOptions: SelectItem[];
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
  districts : any;
  role: number;
  isDistrict : boolean;
  isTaluk:boolean;
  isHostel:boolean;
  constructor(private http: HttpClient, private restApiService: RestAPIService,
    private masterService: MasterService,private messageService: MessageService,private _authService: AuthService) { }

  ngOnInit(): void {
    this.cols = [
      { field: 'Slno', header: 'ID', width: '100px'},
      { field: 'HostelName', header: 'HostelName', width: '100px'},
      { field: 'HostelNameTamil', header: 'HostelNameTamil', width: '100px'},
      { field: 'Name', header: 'HType', width: '100px'},
      { field: 'Districtname', header: 'District', width: '100px'},
      { field: 'Talukname', header: 'Taluk', width: '100px'},
      { field: 'BuildingNo', header: 'BuildingNo', width: '100px'},
      { field: 'Street', header: 'Street', width: '100px'},
      { field: 'Landmark', header: 'Landmark', width: '100px'},
      { field: 'Pincode', header: 'Pincode', width: '100px'},
      { field: 'TotalStudent', header: 'TotalStudent', width: '100px'},
      { field: 'Phone', header: 'Phone', width: '100px'},
      { field: 'HostelImage', header: 'HostelImage', width: '100px'},
 
    ];
     this.Slno = 0;
     this.login_user = this._authService.UserInfo;
     this.Districtcode=this.login_user.districtCode;
     this.TalukId=this.login_user.talukId;
     this.hostelname=this.login_user.hostelName;
    this.role=this.login_user.roleId;
      
  }
  onview() {
    const params = {
      'sType':'0',
      'HostelId': this.hostelname != undefined && this.hostelname != null ? this.hostelname : 0,	
    }
    
    this.restApiService.getByParameters(PathConstants.Hostel_Get, params).subscribe(res => {
      if (res !== null && res !== undefined && res.length !== 0) {
        this.data = res.Table;
        console.log(this.data);
      }

    });

  }
  onSelect(type) {
    let hostelSelection = [];
    let districtSelection = [];
    let talukSelection = [];
  
    switch (type) {   
      case 'HT':
        this.Hosteltypes.forEach(h => {
          hostelSelection.push({ label: h.name, value: h.code });
        });
        this.HosteltypeOptions = hostelSelection;
        break;
      case 'D':
          this.Districtcodes.forEach(d => {
            districtSelection.push({ label: d.name, value: d.code });
          })
          this.DistrictcodeOptions = districtSelection;
          this.DistrictcodeOptions.unshift({ label: '-select-', value: null });
          if (this.Districtcode !== null && this.Districtcode !== undefined) {
            this.disableTaluk = false;
          } else {
            this.disableTaluk = true; 
          }
          break;
      case 'TK':
        this.TalukIds.forEach(t => {
          if (t.dcode === this.Districtcode){
          talukSelection.push({ label: t.name, value: t.code });
        }
        });
        this.TalukIdOptions = talukSelection;
        this.TalukIdOptions.unshift({ label: '-select-', value: null });
        break;
        
    }
  }

}
