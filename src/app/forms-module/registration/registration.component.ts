import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { SelectItem } from 'primeng/api';
import { MasterService } from 'src/app/services/master-data.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  studentName: string;
  dob: Date;
  yearRange: string;
  genderOptions: SelectItem[];
  gender: any;
  genders?: any;
  age: number;
  bloodGroup: string;
  bloodGroupOptions: SelectItem[];
  bloodgroups?: any;
  motherTongueOptions: SelectItem[];
  motherTongue: string;
  languages?: any;
  religion: string;
  religionOptions: SelectItem[];
  religions?: any;
  caste: string;
  casteOptions: SelectItem[];
  castes?: any;
  schoolOptions: SelectItem[];
  school: string;
  schools?: any;
  courseOptions: SelectItem[];
  course: string;
  courses?: any;
  districtOptions: SelectItem[];
  district: string;
  districts?: any;
  villageName: string;
  talukOptions: SelectItem[];
  taluk: string;
  taluks?: any;
  mobileNo: string;
  alternateMobNo: string;
  institutionType: string = '1';
  institutionName: string;
  classOptions: SelectItem[];
  class: string;
  classes?: any;
  distanceFromHostel: any;
  distanceFromHome: any;
  isDisability: boolean = false;
  disabilityType: string;
  addressLine1: string;
  addressLine2: string;
  landmark: string;
  pincode: string;
  ifscCode: string;
  bankName: string;
  bankAccNo: string;
  branchName: string;
  lastInstitutionName: string;
  lastAddress: string;
  rationCardNo: string;
  emisNo: string;
  aadharNo: string;
  fatherName: string;
  fatherQulaification: string;
  fatherOccupation: string;
  fatherMobileNo: string;
  motherName: string;
  motherQulaification: string;
  motherOccupation: string;
  motherMobileNo: string;
  studentImage: any = '';
  @ViewChild('f', { static: false }) _registrationForm: NgForm;

  constructor(private _masterService: MasterService, private _router: Router, 
    private _d: DomSanitizer) { }

  ngOnInit(): void {
    const current_year = new Date().getFullYear();
    const start_year_range = current_year - 30;
    this.yearRange = start_year_range + ':' + current_year;
    this.bloodgroups = this._masterService.getMaster('BG');
    this.genders = this._masterService.getMaster('GD');
    this.districts = this._masterService.getMaster('DT');
  }

  onSelect(type) {
    let districtSelection = [];
    let genderSelection = [];
    switch (type) {
      case 'GD':
        this.genders.forEach(g => {
          genderSelection.push({ label: g.name, value: g.code });
        })
        this.genderOptions = genderSelection;
        this.genderOptions.unshift({ label: '-select-', value: null });
        break;
      case 'BG':
        this.bloodGroupOptions = this.bloodgroups;
        break;
      case 'MT':
        this.motherTongueOptions = this.languages;
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

  calculateAge() {
    let timeDiff = Math.abs(Date.now() - this.dob.getTime());
    let age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);
    console.log(age);
    this.age = age;
  }

  onFileUpload($event) {
    const selectedFile = $event.target.files[0];
    const url = window.URL.createObjectURL(selectedFile);
    this.studentImage = this._d.bypassSecurityTrustUrl(url);

  }

  onRoute() {
    this._router.navigate(['/warden-detailsform']);
  }

}
