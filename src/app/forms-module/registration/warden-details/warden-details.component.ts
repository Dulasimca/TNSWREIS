import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
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


  constructor(private restApiService: RestAPIService) { }

  ngOnInit(): void {
  }

  onSelect(type) {
    
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
    // this.restApiService.post()
  }

}
