import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { SelectItem } from 'primeng/api';
import { Registration } from 'src/app/interfaces/registration';
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
  district: number;
  districts?: any;
  villageName: string;
  talukOptions: SelectItem[];
  taluk: number;
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
  pincode: any;
  ifscCode: string;
  bankName: string;
  bankAccNo: string;
  branchName: string;
  lastInstitutionName: string;
  lastInstitutionAddress: string;
  rationCardNo: string;
  emisNo: string;
  aadharNo: string;
  fatherName: string;
  fatherQulaification: string;
  fatherOccupation: string;
  fatherMobileNo: string;
  fatherYIncome: any;
  motherName: string;
  motherQulaification: string;
  motherOccupation: string;
  motherMobileNo: string;
  motherYIncome: any;
  guardianName: string;
  guardianOccupation: string;
  guardianQulaification: string;
  guardianMobileNo: string;
  guardianYIncome: any;
  studentImage: any = '';
  incomeFilename: string = '';
  tcFilename: string = '';
  bankPassbookFilename: string = '';
  declarationFilename: string = '';
  disableTaluk: boolean = true;
  medium: string;
  courseTitle: string;
  ageTxt: string;
  @ViewChild('f', { static: false }) _registrationForm: NgForm;
  @ViewChild('bankPassBook', { static: false }) _bankPassBook: ElementRef;
  @ViewChild('transferCertificate', { static: false }) _transferCertificate: ElementRef;
  @ViewChild('incomeCertificate', { static: false }) _incomeCertificate: ElementRef;
  @ViewChild('userFile', { static: false }) _studentImg: ElementRef;
  @ViewChild('declarationForm', { static: false }) _declarationForm: ElementRef;

  constructor(private _masterService: MasterService, private _router: Router,
    private _d: DomSanitizer, private _datePipe: DatePipe) { }

  ngOnInit(): void {
    const current_year = new Date().getFullYear();
    const start_year_range = current_year - 30;
    this.yearRange = start_year_range + ':' + current_year;
    this.bloodgroups = this._masterService.getMaster('BG');
    this.genders = this._masterService.getMaster('GD');
    this.districts = this._masterService.getMaster('DT');
    this.languages = this._masterService.getMaster('MT');
    this.castes = this._masterService.getMaster('CS');
    this.classes = this._masterService.getMaster('CL');
    this.courses = this._masterService.getMaster('CU');
  }

  onSelect(type) {
    let districtSelection = [];
    let genderSelection = [];
    let talukSelection = [];
    let bloodGroupSelection = [];
    let languageSelection = [];
    let casteSelection = [];
    let religionSelection = [];
    let classSelection = [];
    let courseSelection = [];
    switch (type) {
      case 'GD':
        this.genders.forEach(g => {
          genderSelection.push({ label: g.name, value: g.code });
        })
        this.genderOptions = genderSelection;
        this.genderOptions.unshift({ label: '-select-', value: null });
        break;
      case 'BG':
        this.bloodgroups.forEach(b => {
          bloodGroupSelection.push({ label: b.name, value: b.code });
        })
        this.bloodGroupOptions = bloodGroupSelection;
        this.bloodGroupOptions.unshift({ label: '-select-', value: null });
        break;
      case 'MT':
        this.languages.forEach(m => {
          languageSelection.push({ label: m.name, value: m.code });
        })
        this.motherTongueOptions = languageSelection;
        this.motherTongueOptions.unshift({ label: '-select-', value: null });
        break;
      case 'DT':
        this.districts.forEach(d => {
          districtSelection.push({ label: d.name, value: d.code });
        })
        this.districtOptions = districtSelection;
        this.districtOptions.unshift({ label: '-select-', value: null });
        if (this.district !== null && this.district !== undefined) {
          this.disableTaluk = false;
        } else {
          this.disableTaluk = true;
        }
        break;
      case 'TK':
        if (this.district !== undefined && this.district !== null) {
          this.taluks.forEach(t => {
            if (t.dcode === this.district) {
              talukSelection.push({ label: t.name, value: t.code });
            }
          })
          this.talukOptions = talukSelection;
          this.talukOptions.unshift({ label: '-select-', value: null });
        }
        break;
      case 'CT':
        this.castes.forEach(c => {
          casteSelection.push({ label: c.name, value: c.code });
        })
        this.casteOptions = casteSelection;
        this.casteOptions.unshift({ label: '-select-', value: null });
        break;
      case 'RL':
        this.religions.forEach(r => {
          religionSelection.push({ label: r.name, value: r.code });
        })
        this.religionOptions = religionSelection;
        this.religionOptions.unshift({ label: '-select-', value: null });
        break;
      case 'CL':
        this.classes.forEach(c => {
          classSelection.push({ label: c.name, value: c.code });
        })
        this.classOptions = classSelection;
        this.classOptions.unshift({ label: '-select-', value: null });
        break;
      case 'CU':
        this.courses.forEach(u => {
          courseSelection.push({ label: u.name, value: u.code });
        })
        this.courseOptions = courseSelection;
        this.courseOptions.unshift({ label: '-select-', value: null });
        break;
    }
  }

  calculateAge() {
    let timeDiff = Math.abs(Date.now() - this.dob.getTime());
    let age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);
    this.age = age;
    this.ageTxt = age + ' Years';
  }

  onFileUpload($event, id) {
    const selectedFile = $event.target.files[0];
    // var fileInput: any = document.getElementById('incomeCertificate');
    // var filePath = fileInput;
    // console.log('path', filePath);
    var allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;

    switch (id) {
      case 1:
        const url = window.URL.createObjectURL(selectedFile);
        this.studentImage = this._d.bypassSecurityTrustUrl(url);
        break;
      case 2:
        break;
    }

  }

  clearForm() {
    this._registrationForm.reset();
    this._registrationForm.form.markAsUntouched();
    this._registrationForm.form.markAsPristine();
    this._studentImg.nativeElement.value = null;
    this._bankPassBook.nativeElement.value = null;
    this._incomeCertificate.nativeElement.value = null;
    this._transferCertificate.nativeElement.value = null;
    this._declarationForm.nativeElement.value = null;
    this.studentImage = '';
    this.tcFilename = '';
    this.bankPassbookFilename = '';
    this.declarationFilename = '';
    this.disableTaluk = true;
    this.isDisability = false;
    this.institutionType = '1';
  }

  onRoute() {
    this._router.navigate(['/warden-detailsform']);
  }

  onSubmit() {
    const data: Registration = {
      studentName: this.studentName,
      age: this.age,
      dob: this._datePipe.transform(this.dob, 'yyyy-MM-dd'),
      bloodGroup: this.bloodGroup,
      gender: this.gender,
      motherTongue: this.motherTongue,
      mobileNo: this.mobileNo,
      altMobNo: this.alternateMobNo,
      religion: this.religion,
      caste: this.caste,
      studentFilename: this.studentImage,
      instituteName: this.institutionName,
      course: this.course,
      medium: this.medium,
      class: this.class,
      courseTitle: this.courseTitle,
      lastStudiedInstituteName: this.lastInstitutionName,
      lastStudiedInstituteAddress: this.lastInstitutionAddress,
      distanceFromHostelToHome: this.distanceFromHostel,
      distanceFromHomeToHostel: this.distanceFromHome,
      disabilityType: this.disabilityType,
      address1: this.addressLine1,
      address2: this.addressLine2,
      landmark: this.landmark,
      distrctCode: this.district,
      talukCode: this.taluk,
      village: this.villageName,
      pincode: this.pincode,
      aadharNo: this.pincode,
      rationCardrNo: this.rationCardNo,
      emisno: this.emisNo,
      bankName: this.bankName,
      bankAccNo: this.bankAccNo,
      ifscCode: this.ifscCode,
      branchName: this.branchName,
      fatherName: this.fatherName,
      fatherOccupation: this.fatherOccupation,
      fatherMoileNo: this.fatherMobileNo,
      fatherQualification: this.fatherQulaification,
      fatherYIncome: this.fatherYIncome,
      motherName: this.motherName,
      motherOccupation: this.motherOccupation,
      motherMoileNo: this.motherMobileNo,
      motherQualification: this.motherQulaification,
      motherYIncome: this.motherYIncome,
      guardianName: this.guardianName,
      guardianOccupation: this.guardianOccupation,
      guardianMoileNo: this.guardianMobileNo,
      guardianQualification: this.guardianQulaification,
      guardianYIncome: this.guardianYIncome,
      incomeCertificateFilename: this.incomeFilename,
      tcFilename: this.tcFilename,
      bankPassbookFilename: this.bankPassbookFilename,
      declarationFilename: this.declarationFilename
    }
  }

}
