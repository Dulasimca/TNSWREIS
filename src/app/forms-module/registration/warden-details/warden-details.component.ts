import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';

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
  dob: number;
  servicedoj: number;
  doj: number;
  qualification: string;
  designation: string;
  email: any;
  yearRange: string;
  taluk: any;
  district: any;
  mobNo: number;
  altMobNo: number
  addressOne: any;
  addressTwo: any;
  pincode: any;


  constructor() { }

  ngOnInit(): void {
  }

  onSelect(type) {
    
  }

}
