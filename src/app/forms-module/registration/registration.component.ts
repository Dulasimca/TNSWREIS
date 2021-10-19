import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MessageService, SelectItem } from 'primeng/api';
import { Registration } from 'src/app/interfaces/registration';
import { User } from 'src/app/interfaces/user';
import { MasterService } from 'src/app/services/master-data.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { RestAPIService } from 'src/app/services/restAPI.service';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { ResponseMessage } from 'src/app/Common-Modules/messages';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';

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
  gender: number;
  genders?: any;
  age: number;
  bloodGroup: number;
  bloodGroupOptions: SelectItem[];
  bloodgroups?: any;
  motherTongueOptions: SelectItem[];
  motherTongue: number;
  languages?: any;
  religion: number;
  religionOptions: SelectItem[];
  religions?: any;
  caste: number;
  casteOptions: SelectItem[];
  castes?: any;
  subCaste: string;
  schoolOptions: SelectItem[];
  school: string;
  schools?: any;
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
  class: number;
  classes?: any;
  distanceFromHostelToHome: number;
  distanceFromHostelToInstitute: number;
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
  totalYIncome: number;
  studentImage: any = '';
  incomeFilename: string = '';
  tcFilename: string = '';
  bankPassbookFilename: string = '';
  declarationFilename: string = '';
  disableTaluk: boolean = true;
  medium: string = '';
  courseTitle: string;
  ageTxt: string;
  logged_user: User;
  studentId: number = 0;
  parentId: number = 0;
  bankId: number = 0;
  documentId: number = 0;
  talukApproval: any = '0';
  districtApproval: any = '0';
  @BlockUI() blockUI: NgBlockUI;
  @ViewChild('f', { static: false }) _registrationForm: NgForm;
  @ViewChild('bankPassBook', { static: false }) _bankPassBook: ElementRef;
  @ViewChild('transferCertificate', { static: false }) _transferCertificate: ElementRef;
  @ViewChild('incomeCertificate', { static: false }) _incomeCertificate: ElementRef;
  @ViewChild('userFile', { static: false }) _studentImg: ElementRef;
  @ViewChild('declarationForm', { static: false }) _declarationForm: ElementRef;

  constructor(private _masterService: MasterService, private _router: Router,
    private _d: DomSanitizer, private _datePipe: DatePipe, private _messageService: MessageService,
    private _restApiService: RestAPIService, private _authService: AuthService) { }

  ngOnInit(): void {
    const current_year = new Date().getFullYear();
    const start_year_range = current_year - 30;
    this.yearRange = start_year_range + ':' + current_year;
    this.logged_user = this._authService.UserInfo;
    this.bloodgroups = this._masterService.getMaster('BG');
    this.taluks = this._masterService.getMaster('TK');
    this.genders = this._masterService.getMaster('GD');
    this.districts = this._masterService.getMaster('DT');
    this.languages = this._masterService.getMaster('MT');
    this.castes = this._masterService.getMaster('CS');
    this.classes = this._masterService.getMaster('CL');
    this.religions = this._masterService.getMaster('RL');
  }

  onSelectType() {
    this.classOptions = [];
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
        var filtered_data = [];
        if (this.institutionType === '1') {
          filtered_data = this.classes.filter(f => {
            return f.type === 1;
          })
        } else {
          filtered_data = this.classes.filter(f => {
            return f.type === 2;
          })
        }
        filtered_data.forEach(c => {
          classSelection.push({ label: c.name, value: c.code });
        })
        this.classOptions = classSelection;
        this.classOptions.unshift({ label: '-select-', value: null });
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
    this.medium = '';
    this.districtApproval = '0';
    this.talukApproval = '0';
  }

  onRoute() {
    this._router.navigate(['/ ']); //purchase-order daily-consumption
  }

  onSubmit() {
    this.blockUI.start();
    const data: Registration = {
      studentId: this.studentId,
      hostelId: this.logged_user.hostelId,
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
      subCaste: this.subCaste,
      studentFilename: this.studentImage,
      instituteName: this.institutionName,
      medium: this.medium,
      classId: this.class,
      courseTitle: this.courseTitle,
      lastStudiedInstituteName: this.lastInstitutionName,
      lastStudiedInstituteAddress: this.lastInstitutionAddress,
      distanceFromHostelToHome: this.distanceFromHostelToHome,
      distanceFromHostelToInstitue: this.distanceFromHostelToInstitute,
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
      talukApproval: this.talukApproval,
      districtApproval: this.districtApproval,
      bankId: this.bankId,
      bankName: this.bankName,
      bankAccNo: this.bankAccNo,
      ifscCode: this.ifscCode,
      branchName: this.branchName,
      parentId: this.parentId,
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
      guardianMobileNo: this.guardianMobileNo,
      guardianQualification: this.guardianQulaification,
      totalYIncome: this.totalYIncome,
      documentId: this.documentId,
      incomeCertificateFilename: this.incomeFilename,
      tcFilename: this.tcFilename,
      bankPassbookFilename: this.bankPassbookFilename,
      declarationFilename: this.declarationFilename,
    }
    this._restApiService.post(PathConstants.Registration_Post, data).subscribe(response => {
      if (response !== undefined && response !== null) {
        if (response) {
          this.blockUI.stop();
          this._messageService.clear();
          this._messageService.add({
            key: 't-msg', severity: ResponseMessage.SEVERITY_SUCCESS,
            summary: ResponseMessage.SUMMARY_SUCCESS, detail: ResponseMessage.SuccessMessage
          })
        } else {
          this.blockUI.stop();
          this._messageService.clear();
          this._messageService.add({
            key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
            summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.ErrorMessage
          })
        }
      } else {
        this.blockUI.stop();
        this._messageService.clear();
        this._messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
          summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.ErrorMessage
        })
      }
    }, (err: HttpErrorResponse) => {
      this.blockUI.stop();
      if (err.status === 0 || err.status === 400) {
        this._messageService.clear();
        this._messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
          summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.ErrorMessage
        })
      }
    })
  }

}
