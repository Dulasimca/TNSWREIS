import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { ResponseMessage } from 'src/app/Common-Modules/messages';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { MasterService } from 'src/app/services/master-data.service';
import { RestAPIService } from 'src/app/services/restAPI.service';

@Component({
  selector: 'app-biometric-devicemapping',
  templateUrl: './biometric-devicemapping.component.html',
  styleUrls: ['./biometric-devicemapping.component.css']
})
export class BiometricDevicemappingComponent implements OnInit {
  hostel: any;
  hostelOptions: SelectItem[];
  bioMetric: any;
  selectedType: number;
  login_user: User;
  Hosteltypes?: any;
  district: number;
  districtOptions: SelectItem[];
  hostels?: any;
  districts?: any;
  nativeDistricts?: any;


  constructor(private _masterService: MasterService,private _restApiService: RestAPIService,private _messageService: MessageService,private _authService: AuthService) { }

  ngOnInit(): void {
    this.login_user = this._authService.UserInfo;
    this.districts = this._masterService.getDistrictAll();


  }

  onView() {

  }

  selectDistrict() {
    this.hostel = null;
    this.hostelOptions = [];
    let hostelSelection = [];
    const params = {
      'Type': 1,
      'DCode': this.district,
      'TCode': (this.login_user.talukId !== undefined && this.login_user.talukId !== null) ?
      this.login_user.talukId : 0,
      'HostelId': (this.login_user.hostelId !== undefined && this.login_user.hostelId !== null) ?
        this.login_user.hostelId : 0,
    }
    if (this.district !== null && this.district !== undefined) {
      this._restApiService.getByParameters(PathConstants.Hostel_Get, params).subscribe(res => {
        if (res !== null && res !== undefined && res.length !== 0) {
          this.hostels = res.Table;
          this.hostels.forEach(h => {
            hostelSelection.push({ label: h.HostelName, value: h.Slno });
          })
          this.hostelOptions = hostelSelection;
          this.hostelOptions.unshift({ label: '-select', value: null });
        };
      })
    }
  }


  onSelect(type) {
    let districtSelection = [];
    switch (type) {
      case 'D':
        this.districts.forEach(d => {
          districtSelection.push({ label: d.name, value: d.code });
        })
        this.districtOptions = districtSelection;
        this.districtOptions.unshift({ label: '-select-', value: null });
        break;

    }
    
  }

  onSubmit() {
    const params = {
      'Slno':0,
      'DeviceId': this.bioMetric,
      'HostelId': this.hostel,
      'Flag': (this.selectedType * 1),
    };
    this._restApiService.post(PathConstants.BioMetric_Post,params).subscribe(res => {
      if (res !== undefined && res !== null) {
        if (res) {
          // this.blockUI.stop();
           this.onClear();
           this.onView();
          this._messageService.clear();
          this._messageService.add({
            key: 't-msg', severity: ResponseMessage.SEVERITY_SUCCESS,
            summary: ResponseMessage.SUMMARY_SUCCESS, detail: ResponseMessage.SuccessMessage
          });

        } else {
          // this.blockUI.stop();
          this._messageService.clear();
          this._messageService.add({
            key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
            summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.ErrorMessage
          });
        }
      } else {
        this._messageService.clear();
        this._messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
          summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.ErrorMessage
        });
      }
    }, (err: HttpErrorResponse) => {
      // this.blockUI.stop();
      if (err.status === 0 || err.status === 400) {
        this._messageService.clear();
        this._messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
          summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.ErrorMessage
        })

      }
    })

  }

  onClear() {

  }
}
