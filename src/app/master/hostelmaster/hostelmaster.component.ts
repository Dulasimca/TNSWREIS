import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { HttpClient  } from '@angular/common/http';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { RestAPIService } from 'src/app/services/restAPI.service';
import { NgForm } from '@angular/forms';
import { ResponseMessage } from 'src/app/Common-Modules/messages';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/Interfaces/user';
import { MasterService } from 'src/app/services/master-data.service';



@Component({
  selector: 'app-hostelmaster',
  templateUrl: './hostelmaster.component.html',
  styleUrls: ['./hostelmaster.component.css']
})
export class HostelmasterComponent implements OnInit {
 
  Hostelname: string;
  Hosteltamilname: string;
  Hosteltype: number;
  Hosteltypes?: any;
  HosteltypeOptions: SelectItem[];
  DistrictcodeOptions: SelectItem[];
  Districtcode: number;
  Districtcodes?: any;
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
  cols: any;
  login_user: User;
  hostelRowId: number;
  @ViewChild('f', { static: false }) _hostelmaster: NgForm;
  constructor(private _masterService: MasterService, private restApiService: RestAPIService,
    private messageService: MessageService,private _authService: AuthService,
    private _messageService: MessageService) { }

  public ngOnInit(): void {
   this.cols = [
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
   this.login_user = this._authService.UserInfo;
    this.Districtcodes = this._masterService.getDistrictAll();
    this.Hosteltypes = this._masterService.getMaster('HT');
    this.TalukIds = this._masterService.getTalukAll();
  }

  onSelect(type) {
    console.log("ent")
    let districtSelection = [];
    let talukSelection = [];
    let hostelSelection = [];
    switch (type) {
      case 'DT':
        this.Districtcodes.forEach(d => {
          districtSelection.push({ label: d.name, value: d.code });
        })
        this.DistrictcodeOptions = districtSelection;
        this.DistrictcodeOptions.unshift({ label: '-select-', value: null });
        break;
      case 'TK':
        if (this.Districtcode !== undefined && this.Districtcode !== null) {
          this.TalukIds.forEach(t => {
            if (t.dcode === this.Districtcode) {
              talukSelection.push({ label: t.name, value: t.code });
            }
          })
          this.TalukIdOptions = talukSelection;
          this.TalukIdOptions.unshift({ label: '-select-', value: null });
        }
        break;
        case 'HT':
        this.Hosteltypes.forEach(h => {
          hostelSelection.push({ label: h.name, value: h.code });
        })
        this.HosteltypeOptions = hostelSelection;
        this.HosteltypeOptions.unshift({ label: '-select-', value: null });
          break;
        
    }
  }

  onSubmit() {
      const params = {
      'Slno': (this.hostelRowId != undefined && this.hostelRowId !== null) ? this.hostelRowId : 0,
      'HostelName': this.Hostelname,
      'HostelNameTamil': this.Hosteltamilname,
      'HTypeId': this.Hosteltype,
      'Districtcode': this.Districtcode,
      'Talukid': this.TalukId,
      'BuildingNo': this.Buildingno,
      'Street': this.Street,
      'Landmark': this.Landmark,
      'Pincode': this.pincode,
      'TotalStudent': this.Totalstudent,
      'Phone': this.mobileNo,
    };
      this.restApiService.post(PathConstants.Hostel_Post,params).subscribe(res => {
        if (res) {
          this.clear();
          this.onView();
          this.messageService.clear();
          this.messageService.add({
            key: 't-msg', severity: ResponseMessage.SEVERITY_SUCCESS,
            summary: ResponseMessage.SUMMARY_SUCCESS, detail: ResponseMessage.SuccessMessage
          });
        } else {
          this.messageService.clear();
          this.messageService.add({
            key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
            summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.ErrorMessage
          });
        }
      }, (err: HttpErrorResponse) => {
        if (err.status === 0 || err.status === 400) {
          this.messageService.clear();
          this.messageService.add({
            key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
            summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.ErrorMessage
          })
        }
      })
    }
  
    
  
  onView() {
    this.data = [];
    const params = {
      'sType':'0',
      'Id': (this.login_user.districtCode !== undefined && this.login_user.districtCode !== null) 
      ? this.login_user.districtCode : 0,
      'TCode': (this.login_user.talukId !== undefined && this.login_user.talukId !== null) ?
       this.login_user.talukId : 0,
      'HCode': (this.login_user.hostelId !== undefined && this.login_user.hostelId !== null) ? this.login_user.hostelId : 0,
    }
    this.restApiService.getByParameters(PathConstants.Hostel_Get, params).subscribe(res => {
      if (res !== null && res !== undefined && res.length !== 0) {
        this.data = res.Table;
      }  else {
        this._messageService.clear();
        this._messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_WARNING,
          summary: ResponseMessage.SUMMARY_WARNING, detail: ResponseMessage.NoRecordMessage
        })
      }
    });
  }
  clear() {
    this._hostelmaster.reset();
  }
  onRowSelect(event, selectedRow) {
    if(selectedRow !== null && selectedRow !==undefined){
    this.hostelRowId = selectedRow.Slno;
    this.Hosteltype = selectedRow.HTypeId;
    this.HosteltypeOptions = [{ label: selectedRow.Name, value: selectedRow.HTypeId }];
    this.Districtcode = selectedRow.Districtcode;
    this.DistrictcodeOptions = [{ label: selectedRow.Districtname, value: selectedRow.Districtcode}];
    this.TalukId = selectedRow.Talukid;
    this.TalukIdOptions = [{ label: selectedRow.Talukname, value: selectedRow.Talukid}];
    this.Hostelname = selectedRow.HostelName;
    this.Hosteltamilname = selectedRow.HostelNameTamil;
    this.Buildingno = selectedRow.BuildingNo;
    this.Street = selectedRow.Street; 
    this.Landmark = selectedRow.Landmark;
    this.pincode = selectedRow.Pincode;
    this.Totalstudent = selectedRow.TotalStudent;
    this.mobileNo = selectedRow.Phone;
 }
  }

}
