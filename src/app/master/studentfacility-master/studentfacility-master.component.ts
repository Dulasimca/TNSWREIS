import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MessageService, SelectItem } from 'primeng/api';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { RestAPIService } from 'src/app/services/restAPI.service';
import { ResponseMessage } from 'src/app/Common-Modules/messages';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-studentfacility-master',
  templateUrl: './studentfacility-master.component.html',
  styleUrls: ['./studentfacility-master.component.css']
})
export class StudentfacilityMasterComponent implements OnInit {
  districtName: string;
  talukName: string;
  hostelName: string;
  facilityName: number;
  FacilitynameOptions: SelectItem[];
  noofCounts: number;
  remarks: string;
  login_user: User;
  Districtcode: number;
  TalukId: number;
  HostelId: number;
  cols: any;
  data: any = [];
  // facilitySelection?:any = [];
  facilityNames?:any = [];
  FacilityDetailIds = 0;
  

  @ViewChild ('f', { static: false }) facilityForm: NgForm;
  constructor(private _authService: AuthService,private _restApiService: RestAPIService,private _messageService: MessageService) { }

  ngOnInit(): void {
    this.cols = [
      { field: 'Districtname', header: 'Districtname', width: '200px'},
      { field: 'Talukname', header: 'HostelName', width: '200px'},
      { field: 'HostelName', header: 'HostelName', width: '200px'},
      { field: 'FacilityName', header: 'FacilityName', width: '200px'},
      { field: 'NoOfCounts', header: 'NoOfCounts', width: '200px'},
      { field: 'Remarks', header: 'Remarks', width: '200px'},
    ];
    this.login_user = this._authService.UserInfo;
    this.districtName = this.login_user.districtName;
    this.talukName = this.login_user.talukName;
    this.hostelName = this.login_user.hostelName;
    this.Districtcode = this.login_user.districtCode;
    this.TalukId = this.login_user.talukId;
    this.HostelId = this.login_user.hostelId;

    this._restApiService.get(PathConstants.StudentFacility_Get).subscribe(facilityNames => {
      this.facilityNames = facilityNames;
      console.log(this.facilityNames)
    })
    this.onView();
  }

  onSubmit() {
    const params = {
      'FacilityDetailId': this.FacilityDetailIds,
      'HostelID': this.HostelId,
      'Districtcode': this.Districtcode,
      'Talukid': this.TalukId,
      'FacilityId': this.facilityName,
      'NoOfCounts': this.noofCounts,
      'Remarks': this.remarks,
      'Flag': 1,
    };
    this._restApiService.post(PathConstants.StudentFacility_Post,params).subscribe(res => {
      if (res !== undefined && res !== null) {
        if (res) {
          // this.blockUI.stop();
           this.onClear();
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
  onView() {
    this.data = [];
    const params = {
   'DCode' : this.login_user.districtCode,
   'TCode' : this.login_user.talukId,
   'HostelId' : this.login_user.hostelId,
    }
    this._restApiService.getByParameters(PathConstants.StudentFacilityDetails_Get,params).subscribe(res =>{
      if (res !== null && res !== undefined && res.length !== 0) {
        res.Table.forEach(i => {
          this.data = res.Table;
    })
    
  } else {
    this._messageService.clear();
    this._messageService.add({
      key: 't-msg', severity: ResponseMessage.SEVERITY_WARNING,
      summary: ResponseMessage.SUMMARY_WARNING, detail: ResponseMessage.NoRecordMessage
    })
  }
});
}
  onSelect(type){
    let facilitySelection = [];
    switch (type) {
      case 'FC':
            this.facilityNames.forEach(c => {
              facilitySelection.push({ label:c.FacilityName, value: c.Id });
          })
          this.FacilitynameOptions = facilitySelection;
          this.FacilitynameOptions.unshift({ label: '-select', value: null });
      break;
    }
  }
  onRowSelect(event, selectedRow) {
   this.FacilityDetailIds = selectedRow.FacilityDetailId;
   this.facilityName = selectedRow.FacilityId;
   this.FacilitynameOptions = [{ label: selectedRow.FacilityName, value: selectedRow.FacilityId}];
   this.noofCounts = selectedRow.NoOfCounts;
   this.remarks = selectedRow.Remarks;
  }
  onClear(){
    this.facilityForm.form.markAsUntouched();
    this.facilityName = null;
    this.FacilitynameOptions = [];
    this.noofCounts = null;
    this.remarks = null;
    this.FacilityDetailIds = 0;
  }
}



