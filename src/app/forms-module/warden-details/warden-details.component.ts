import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { MessageService, SelectItem } from 'primeng/api';
import { ResponseMessage } from 'src/app/Common-Modules/messages';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { TableConstants } from 'src/app/Common-Modules/table-constants';
import { MasterService } from 'src/app/services/master-data.service';
import { RestAPIService } from 'src/app/services/restAPI.service';

@Component({
  selector: 'app-warden-details',
  templateUrl: './warden-details.component.html',
  styleUrls: ['./warden-details.component.css']
})
export class WardenDetailsComponent implements OnInit {

  wardenName: string;
  gender: any;
  genderOptions: SelectItem[];
  talukOptions: SelectItem[];
  districtOptions: SelectItem[];
  hostelOptions: SelectItem[];
  qualificationOptions: SelectItem[];
  dob: any;
  servicedoj: any;
  hostelJoin: any;
  hstlLeaveDate: any;
  qualification: any;
  designation: string;
  hostelName: number;
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
  cols : any;
  data : any = [];
  wardenImage: any = '';
  genders?: any;
  districts?: any;
  taluks?: any;
  hostels?: any;
  courses?: any;
  showTable: boolean;
  @ViewChild('f', { static: false }) _wardenDetails: NgForm;

  constructor(private restApiService: RestAPIService, private messageService: MessageService , private masterService: MasterService,   private _d: DomSanitizer, private _tableConstants: TableConstants, 
    private _datePipe:DatePipe) { }

  ngOnInit(): void {
    this.cols = this._tableConstants.wardenTableColumns;
    const current_year = new Date().getFullYear();
    const start_year_range = current_year - 70;
    this.yearRange = start_year_range + ':' + current_year;
    this.genders = this.masterService.getMaster('GD');
    this.districts = this.masterService.getMaster('DT');
    this.taluks = this.masterService.getMaster('TK');
    // this.hostels = this.masterService.getMaster('HN');
    this.courses = this.masterService.getMaster('CU');
  }

  onSelect(type) {
    let genderSelection = [];
    let districtSelection = [];
    let talukSelection = [];
    let hostelSelection = [];
    let courseSelection = [];
    switch (type) {
      case 'GD':
        this.genders.forEach(g => {
          genderSelection.push({ label: g.name, value: g.code });
        })
        this.genderOptions = genderSelection;
        this.genderOptions.unshift({ label: '-select-', value: null });
        break;
          case 'T':
            this.taluks.forEach(t => {
              talukSelection.push({ label: t.name, value: t.code });
            })
            this.talukOptions = talukSelection;
            this.talukOptions.unshift({ label: '-select-', value: null });
            break;
            case 'HN':
              this.hostels.forEach(h => {
                hostelSelection.push({ label: h.HostelName, value: h.Slno });
              })
              this.hostelOptions = hostelSelection;
              this.hostelOptions.unshift({ label: '-select', value: null });
              break;
              case 'CU':
                this.courses.forEach(q => {
                  courseSelection.push({ label: q.name, value: q.code });
                })
                this.qualificationOptions = courseSelection;
                this.qualificationOptions.unshift({ label: '-select-', value: null });
                break;
                case 'DT':
                  this.districts.forEach(d => {
                    districtSelection.push({ label: d.name, value: d.code });
                  })
                  this.districtOptions = districtSelection;
                  this.districtOptions.unshift({ label: '-select-', value: null });
                  break;
      }
    }
    selectDistrict() {
      const params = {
        'Type': 1,
        'Value': this.district
  
      }
      if (this.district !== null && this.district !== undefined) {
        this.restApiService.getByParameters(PathConstants.Hostel_Get, params).subscribe(res => {
          if (res !== null && res !== undefined && res.length !== 0) {
            this.hostels = res.Table;
            console.log('h',res);
          };
  
        })
      }
    }
    onFileUpload($event) {
      const selectedFile = $event.target.files[0];
      {
          const url = window.URL.createObjectURL(selectedFile);
          this.wardenImage = this._d.bypassSecurityTrustUrl(url);
      }
    }
  onSave() {
    const params =  {
      'Name' : this.wardenName,
      'GenderId': this.gender,
      'DOB' : this._datePipe.transform(this.dob, 'yyyy-MM-dd'),
      'Qualification' : this.qualification,
      'HostelId': this.hostelName,
      'HostelJoinedDate' : this._datePipe.transform(this.hostelJoin, 'yyyy-MM-dd'),
      'ServiceJoinedDate': this._datePipe.transform(this.servicedoj, 'yyyy-MM-dd'),
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
      'WardenId': 0

    };
    this.restApiService.post(PathConstants.Warden_post,params).subscribe(res => {
      if (res) {
        this.clearform();
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
    const params = {
        'Type': 2,
        'Value': 0
        }
        this.restApiService.getByParameters(PathConstants.Warden_Get, params).subscribe(res => {
          if(res !== null && res !== undefined && res.length !== 0) {
          console.log('res', res);
          this.data = res.Table;
          }
        });
  }

  onEdit(selectedRow){
    if(selectedRow !== null && selectedRow !==undefined){
    this.wardenName = selectedRow.Name;
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
    this.district = selectedRow.Districtcode;
    this.districtOptions = [{ label: selectedRow.Districtname, value: selectedRow.Districtcode }];
    this.hostelName = selectedRow.HostelId;
    this.hostelOptions = [{ label: selectedRow.HostelName , value: selectedRow.Slno}];
    this.taluk = selectedRow.Talukid;
    this.talukOptions = [{ label: selectedRow.Talukname, value: selectedRow.Talukid}];
    this.altMobNo = selectedRow.AlternateNo;
    this.pincode = selectedRow.Pincode;
    }
  }

  clearform() {
    this._wardenDetails.reset();
    this.talukOptions = [];
    this.districtOptions = [];
    this.genderOptions = [];
    this.qualificationOptions = [];
    this.hostelOptions = [];
  }
}
