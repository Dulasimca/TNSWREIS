import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MessageService, SelectItem } from 'primeng/api';
import { ResponseMessage } from 'src/app/Common-Modules/messages';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
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
  dob: number;
  servicedoj: number;
  doj: number;
  hosteljoin: number;
  hstlLeaveDate: number;
  qualification: string;
  designation: string;
  hostelName: string;
  email: any;
  yearRange: string;
  taluk: any;
  district: any;
  mobNo: number;
  altMobNo: number
  addressOne: any;
  addressTwo: any;
  pincode: any;
  wardenImage: string;

  genders?: any;
  districts?: any;
  taluks?: any;
  @ViewChild('f', { static: false }) _wardenDetails: NgForm;



  constructor(private restApiService: RestAPIService, private messageService: MessageService , private masterService: MasterService) { }

  ngOnInit(): void {

    this.genders = this.masterService.getMaster('G');
    this.districts = this.masterService.getMaster('D');
    this.taluks = this.masterService.getMaster('T');

  }

  onSelect(type) {
    let genderSelection = [];
    let districtSelection = [];
    let talukSelection = [];


    switch (type) {
      case 'G':
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
          case 'T':
            this.taluks.forEach(t => {
              talukSelection.push({ label: t.name, value: t.code });
            })
            this.talukOptions = talukSelection;
            this.talukOptions.unshift({ label: '-select-', value: null });
            break;
      }
    }
  onFileUpload($event) {

  }
  onSave() {
    const params =  {
      'Name' : this.wardenName,
      'DOB' : this.dob,
      'Qualification' : this.qualification,
      'HostelJoinedDate' : this.hosteljoin,
      'ServiceJoinedDate': this.servicedoj,
      'Designation': this.designation,
      'EMail': this.email,
      'PhoneNo': this.mobNo,
      'AlternateNo': this.altMobNo,
      'Address1': this.addressOne,
      'Address2': this.addressTwo,
      'Pincode': this.pincode,
      'Flag' : true

    };
    this.restApiService.post(PathConstants.Warden_post,params).subscribe(res => {
      if (res) {
        console.log('s',res);
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
  clearform() {
    this._wardenDetails.reset();
  }
  

}
