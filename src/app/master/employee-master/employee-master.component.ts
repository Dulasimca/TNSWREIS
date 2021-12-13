import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MessageService, SelectItem } from 'primeng/api';
import { ResponseMessage } from 'src/app/Common-Modules/messages';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { MasterService } from 'src/app/services/master-data.service';
import { RestAPIService } from 'src/app/services/restAPI.service';

@Component({
  selector: 'app-employee-master',
  templateUrl: './employee-master.component.html',
  styleUrls: ['./employee-master.component.css']
})
export class EmployeeMasterComponent implements OnInit {
  designationName: number;
  designationOptions: SelectItem[];
  firstName: string;
  lastName: string;
  doj: any;
  genderOptions: SelectItem[];
  genders?: any;
  gender: any;
  address: any;
  districtOptions: SelectItem[];
  districts?: any;
  nativeDistrict: any;
  mobileNo: string;
  cols: any;
  data: any = [];
  employeeDesignation?:any = [];
  Districtcode: number;
  TalukId: number;
  HostelId: number;
  login_user: User;
  RowId: 0;
  
  @ViewChild ('f', { static: false }) employeeForm: NgForm;
  constructor(private _authService: AuthService,private _masterService: MasterService
    ,private _restApiService: RestAPIService,private _messageService: MessageService,private _datePipe: DatePipe) { }

  ngOnInit(): void {

    this.cols = [
      { field: 'district1', header: 'District Name', width: '100px', align: 'left !important'},
      { field: 'Talukname', header: 'Taluk Name', width: '100px', align: 'left !important'},
      { field: 'HostelName', header: 'Hostel Name', width: '100px', align: 'left !important'},
      { field: 'DesignationName', header: 'Designation', width: '100px', align: 'left !important'},
      { field: 'FirstName', header: 'First Name', width: '100px', align: 'left !important'},
      { field: 'LastName', header: 'Last Name', width: '100px', align: 'left !important'},
      { field: 'Doj', header: 'Doj', width: '100px', align: 'left !important'},
      { field: 'GenderName', header: 'Gender', width: '100px', align: 'left !important'},
      { field: 'Address', header: 'Address', width: '100px', align: 'left !important'},
      { field: 'NativeDistrict', header: 'Native District', width: '100px', align: 'left !important'},
      { field: 'MobileNo', header: 'Mobile No', width: '100px', align: 'left !important'},
   ];
    this.login_user = this._authService.UserInfo;
    this.genders = this._masterService.getMaster('GD');
    this.districts = this._masterService.getDistrictAll();
    this.Districtcode = this.login_user.districtCode;
    this.TalukId = this.login_user.talukId;
    this.HostelId = this.login_user.hostelId;

    this._restApiService.get(PathConstants.EmployeeDesignation_Get).subscribe(employeeDesignation => {
      this.employeeDesignation = employeeDesignation;
    })
  }

  onView() {
    this.data = [];
    const params = {
   'DCode' : this.login_user.districtCode,
   'TCode' : this.login_user.talukId,
   'HostelId' : this.login_user.hostelId,
    }
    this._restApiService.getByParameters(PathConstants.EmployeeDetails_Get,params).subscribe(res =>{
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

  onSubmit() {
    const params = {
      'Id': this.RowId,
      'HostelID': this.HostelId,
      'Districtcode': this.Districtcode,
      'Talukid': this.TalukId,
      'Designation': this.designationName,
      'FirstName': this.firstName,
      'LastName': this.lastName,
      'Doj': this._datePipe.transform(this.doj, 'MM/dd/yyyy'),
      'Gender': this.gender,
      'Address': this.address,
      'NativeDistrict': this.nativeDistrict,
      'MobileNo': this.mobileNo,
      'Flag': 1,
    };
    this._restApiService.post(PathConstants.EmployeeDetails_Post,params).subscribe(res => {
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

  onSelect(type) {
    let genderSelection = [];
    let districtSelection = [];
    let designationSelection =[];
    switch (type) {
      case 'GD':
        this.genders.forEach(g => {
          genderSelection.push({ label: g.name, value: g.code });
        })
        this.genderOptions = genderSelection;
        this.genderOptions.unshift({ label: '-select-', value: null });
        break;
        case 'DT':
          this.districts.forEach(d => {
            districtSelection.push({ label: d.name, value: d.code });
          })
          this.districtOptions = districtSelection;
          this.districtOptions.unshift({ label: '-select-', value: null });
          break;
        case 'ED':
            this.employeeDesignation.forEach(c => {
              designationSelection.push({ label:c.Name, value: c.Id });
          })
          this.designationOptions = designationSelection;
          this.designationOptions.unshift({ label: '-select', value: null });
          break;
  }
}

onRowSelect(event, selectedRow) {
  this.RowId = selectedRow.Id;
  this.designationName = selectedRow.Designation;
  this.designationOptions = [{ label: selectedRow.DesignationName, value: selectedRow.Designation}];
  this.firstName = selectedRow.FirstName;
  this.lastName = selectedRow.LastName;
  this.doj = new Date(selectedRow.Doj);
  this.gender = selectedRow.Gender;
  this.genderOptions = [{ label: selectedRow.GenderName, value: selectedRow.Gender}];
  this.address = selectedRow.Address;
  this.nativeDistrict = selectedRow.NativeDistrictID;
  this.districtOptions = [{ label: selectedRow.NativeDistrict, value: selectedRow.NativeDistrictID}];
  this.mobileNo = selectedRow.MobileNo;
}

onClear() {
  this.employeeForm.form.markAsUntouched();
 
  this.firstName = null;
  this.lastName = null;
  this.doj = new Date();
  this.gender = null;
  this.genderOptions = [];
  this.address = null;
  this.mobileNo = null;
  this.RowId = 0;
}

}
