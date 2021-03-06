import { DatePipe } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { MessageService, SelectItem } from 'primeng/api';
import { GlobalVariable } from 'src/app/Common-Modules/GlobalVariables';
import { ResponseMessage } from 'src/app/Common-Modules/messages';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { TableConstants } from 'src/app/Common-Modules/table-constants';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { MasterService } from 'src/app/services/master-data.service';
import { RestAPIService } from 'src/app/services/restAPI.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-warden-details',
  templateUrl: './warden-details.component.html',
  styleUrls: ['./warden-details.component.css']
})
export class WardenDetailsComponent implements OnInit {

  wardenName: string;
  wardenId: number;
  gender: any;
  genderOptions: SelectItem[];
  talukOptions: SelectItem[];
  districtOptions: SelectItem[];
  hostelOptions: SelectItem[];
  qualificationOptions: SelectItem[];
  nativeDistrictOptions: SelectItem[];
  dob: Date;
  servicedoj: any;
  hostelJoin: any;
  hstlLeaveDate: any;
  qualification: any;
  designation: string;
  hostelName: any;
  email: any;
  yearRange: string;
  taluk: number;
  district: number;
  nativeDistrict: number;
  mobNo: number;
  altMobNo: number;
  addressOne: any;
  addressTwo: any;
  pincode: any;
  cols: any;
  data: any = [];
  wardenImage: any = '';
  genders?: any;
  districts?: any;
  taluks?: any;
  hostels?: any;
  courses?: any;
  nativeDistricts?: any;
  showTable: boolean;
  disableTaluk: boolean;
  logged_user: User;
  wardenFileName: string;
  disableSave: boolean;
  loading: boolean;
  dobYearRange: string;
  pincode_max: number;
  serviceMinDate: Date;
  public formData = new FormData();
  @ViewChild('f', { static: false }) _wardenForm: NgForm;

  constructor(private restApiService: RestAPIService, private messageService: MessageService,
    private masterService: MasterService, private _d: DomSanitizer,
    private _tableConstants: TableConstants, private _utilsService: UtilsService,
    private _datePipe: DatePipe, private http: HttpClient, private authService: AuthService) { }

  ngOnInit(): void {
    this.pincode_max = GlobalVariable.PINCODE_MAX;
    this.cols = this._tableConstants.wardenTableColumns;
    this.logged_user = this.authService.UserInfo;
    this.dobYearRange = GlobalVariable.START_YEAR_RANGE + ':' + GlobalVariable.EMPLOYEE_DOB_MAX_YEAR;
    this.yearRange = GlobalVariable.START_YEAR_RANGE + ':' + GlobalVariable.CURRENT_YEAR;
    this.genders = this.masterService.getMaster('GD');
    this.districts = this.masterService.getDistrictAll();
    this.nativeDistricts = this.masterService.getDistrictAll();
    this.taluks = this.masterService.getTalukAll();
    // this.hostels = this.masterService.getMaster('HN');
    // this.courses = this.masterService.getMaster('CU');
    this.courses = this.masterService.getMaster('CL');
    this.disableTaluk = true;
    this.wardenId = 0;
    this.disableSave = ((this.logged_user.roleId * 1) === 4) ? true : false;
  }

  onSelect(type) {
    let genderSelection = [];
    let districtSelection = [];
    let talukSelection = [];
    let courseSelection = [];
    let nativeDistrictSelection = [];
    switch (type) {
      case 'GD':
        this.genders.forEach(g => {
          genderSelection.push({ label: g.name, value: g.code });
        })
        this.genderOptions = genderSelection;
        this.genderOptions.unshift({ label: '-select-', value: null });
        break;
      case 'D':
        this.districts.forEach(d => {
          districtSelection.push({ label: d.name, value: d.code });
        })
        this.districtOptions = districtSelection;
        this.districtOptions.unshift({ label: '-select-', value: null });
        break;
      case 'ND':
        this.nativeDistricts.forEach(d => {
          nativeDistrictSelection.push({ label: d.name, value: d.code });
        })
        this.nativeDistrictOptions = nativeDistrictSelection;
        this.nativeDistrictOptions.unshift({ label: '-select-', value: null });
        break;
      case 'T':
        // if(this.nativeDistrict !== undefined && this.nativeDistrict !== null) {
        //   this.disableTaluk = false;

        this.taluks.forEach(t => {
          if (t.dcode === this.nativeDistrict) {
            talukSelection.push({ label: t.name, value: t.code });
          }
        })

        this.talukOptions = talukSelection;
        this.talukOptions.unshift({ label: '-select-', value: null });
        break;
      case 'CU':
        var filtered_data = [];
        filtered_data = this.courses.filter(f => {
          return f.type === 2;
        })
        console.log('f', filtered_data)
        filtered_data.forEach(q => {
          courseSelection.push({ label: q.name, value: q.code });
        })
        this.qualificationOptions = courseSelection;
        this.qualificationOptions.unshift({ label: '-select-', value: null });
        break;
    }
  }

  getServiceMinDate() {
    this.serviceMinDate = this._utilsService.findMinDate(this.dob);
    let msg = '';
    if(this.hostelJoin !== null && this.hostelJoin !== undefined && this.hostelJoin < this.serviceMinDate) {
      msg = 'Please select valid hostel joining date !'
    } else {
      msg = '';
      this.hostelJoin = null;
    }
    if (this.servicedoj !== null && this.servicedoj !== undefined && this.servicedoj < this.serviceMinDate) {
      msg = 'Please select valid hostel joining date !'
    } else {
      msg = '';
      this.servicedoj = null;
    }
      this.messageService.clear();
      this.messageService.add({
        key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
        summary: ResponseMessage.SUMMARY_ERROR, detail: msg
      });
  }

  refreshTaluk() {
    this.taluk = null;
    this.talukOptions = [];
  }

  selectDistrict() {
    this.hostelName = null;
    this.hostelOptions = [];
    let hostelSelection = [];
    const params = {
      'Type': 1,
      'DCode': this.district,
      'TCode': (this.logged_user.talukId !== undefined && this.logged_user.talukId !== null) ?
        this.logged_user.talukId : 0,
      'HostelId': (this.logged_user.hostelId !== undefined && this.logged_user.hostelId !== null) ?
        this.logged_user.hostelId : 0,
    }
    if (this.district !== null && this.district !== undefined) {
      this.restApiService.getByParameters(PathConstants.Hostel_Get, params).subscribe(res => {
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

  public uploadFile = (event) => {
    const selectedFile = event.target.files[0];
    {
      const url = window.URL.createObjectURL(selectedFile);
      this.wardenImage = this._d.bypassSecurityTrustUrl(url);
    }
    this.formData = new FormData()
    let fileToUpload: any = <File>event.target.files[0];
    const folderName = this.logged_user.hostelId + '/' + 'Documents';
    var curr_datetime = this._datePipe.transform(new Date(), 'ddMMyyyyhmmss') + new Date().getMilliseconds();
    const uploadedFilename = (fileToUpload.name).toString();
    const extension = uploadedFilename.substring(uploadedFilename.lastIndexOf('.') + 1, uploadedFilename.length);
    var filenameWithExtn = curr_datetime + '.' + extension;
    const filename = fileToUpload.name + '^' + folderName + '^' + filenameWithExtn;
    this.formData.append('file', fileToUpload, filename);
    this.wardenFileName = filenameWithExtn;
    this.http.post(this.restApiService.BASEURL + PathConstants.FileUpload_Post, this.formData)
      .subscribe(event => {
      }
      );
    return filenameWithExtn;
  }

  // onFileUpload($event) {
  //   const selectedFile = $event.target.files[0];
  //   {
  //       const url = window.URL.createObjectURL(selectedFile);
  //       this.wardenImage = this._d.bypassSecurityTrustUrl(url);
  //   }
  // }
  onSave() {
    const params = {
      'Name': this.wardenName,
      'GenderId': this.gender,
      'DOB': this._datePipe.transform(this.dob, 'MM-dd-yyyy'),
      'Qualification': this.qualification,
      'HostelId': this.hostelName,
      'HostelJoinedDate': this._datePipe.transform(this.hostelJoin, 'MM-dd-yyyy'),
      'ServiceJoinedDate': this._datePipe.transform(this.servicedoj, 'MM-dd-yyyy'),
      'Designation': this.designation,
      'EMail': this.email,
      'PhoneNo': this.mobNo,
      'AlternateNo': this.altMobNo,
      'Address1': this.addressOne,
      'Address2': this.addressTwo,
      'Districtcode': this.district,
      'Talukid': this.taluk,
      'Pincode': this.pincode,
      'Flag': 1,
      'WardenId': this.wardenId,
      'WardenImage': this.wardenFileName
      // 'WardenImage': this.wardenImage,
      // 'EndDate': ''

    };
    this.restApiService.post(PathConstants.Warden_post, params).subscribe(res => {
      if (res) {
        this.onView();
        this.onClear();
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
    this.showTable = true;
    this.loading = true;
    const params = {
      'DCode': (this.logged_user.districtCode !== undefined && this.logged_user.districtCode !== null)
        ? this.logged_user.districtCode : 0,
      'TCode': (this.logged_user.talukId !== undefined && this.logged_user.talukId !== null) ?
        this.logged_user.talukId : 0,
      'Value': (this.logged_user.hostelId !== undefined && this.logged_user.hostelId !== null) ? this.logged_user.hostelId : 0

    }
    this.restApiService.getByParameters(PathConstants.Warden_Get, params).subscribe(res => {
      if (res !== null && res !== undefined && res.length !== 0) {
        this.data = res.Table;
        this.loading = false;
      } else {
        this.loading = true;
      }
    });
  }

  onEdit(selectedRow) {
    if (selectedRow !== null && selectedRow !== undefined) {
      this.disableSave = false;
      this.wardenName = selectedRow.Name;
      this.wardenId = selectedRow.WardenId;
      this.gender = selectedRow.GenderId;
      this.genderOptions = [{ label: selectedRow.GenderName, value: selectedRow.GenderId }];
      this.dob = new Date(selectedRow.DOB);
      this.designation = selectedRow.Designation;
      this.qualification = selectedRow.Qualification;
      this.qualificationOptions = [{ label: selectedRow.CourseName, value: selectedRow.Qualification }];
      this.servicedoj = new Date(selectedRow.ServiceJoinedDate);
      this.hostelJoin = new Date(selectedRow.HostelJoinedDate);
      this.email = selectedRow.EMail;
      this.mobNo = selectedRow.PhoneNo;
      this.addressOne = selectedRow.Address1;
      this.addressTwo = selectedRow.Address2;
      this.nativeDistrict = selectedRow.Districtcode;
      this.nativeDistrictOptions = [{ label: selectedRow.Districtname, value: selectedRow.Districtcode }];
      this.hostelName = selectedRow.HostelId;
      this.hostelOptions = [{ label: selectedRow.HostelName, value: selectedRow.Slno }];
      this.taluk = selectedRow.Talukid;
      this.talukOptions = [{ label: selectedRow.Talukname, value: selectedRow.Talukid }];
      this.district = selectedRow.HostelDCode;
      this.districtOptions = [{ label: selectedRow.HostelDName, value: selectedRow.HostelDCode }];
      this.altMobNo = selectedRow.AlternateNo;
      this.pincode = selectedRow.Pincode;
      this.wardenFileName = selectedRow.WardenImage;
      var filePath = 'assets/layout/' + this.logged_user.hostelId + '/Documents' + '/' + this.wardenFileName;
      this.wardenImage = filePath;
    }
  }

  validateFields(field) {
    switch (field) {
      case 'P':
        if (this.pincode !== null && this.pincode !== undefined) {
          if (this.pincode > this.pincode_max) {
            this._wardenForm.controls['_pincode'].setErrors({ 'incorrect': true });
          }
        } else {
          this._wardenForm.controls['_pincode'].setErrors({ 'incorrect': true });
        }
        break;
      case 'M':
        if (this.mobNo !== null && this.mobNo !== undefined && this.altMobNo !== null 
          && this.altMobNo !== undefined) {
          if (this.mobNo.toString().length === 10 && this.altMobNo.toString().length === 10 &&
            this.mobNo.toString() === this.altMobNo.toString()) {
            this._wardenForm.controls['_mobno'].setErrors({ 'incorrect': true });
          } else {
            this._wardenForm.controls['_mobno'].setErrors({ 'incorrect': true });
          }
        }
        break;
    }
  }

  onClear() {
    this._wardenForm.form.reset();
    this._wardenForm.form.markAsUntouched();
    this._wardenForm.form.markAsPristine();
    this.wardenId = 0;
    this.talukOptions = [];
    this.districtOptions = [];
    this.genderOptions = [];
    this.qualificationOptions = [];
    this.hostelOptions = [];
    this.nativeDistrictOptions = [];
    this.data = [];
    this.wardenImage = null;
    this.disableSave = ((this.logged_user.roleId * 1) === 4) ? true : false;
  }
}
