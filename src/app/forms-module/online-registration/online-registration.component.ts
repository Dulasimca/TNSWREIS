import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { MessageService, SelectItem } from 'primeng/api';
import { OnlineRegistration } from 'src/app/interfaces/onlineRegistration';
import { User } from 'src/app/interfaces/user';
import { MasterService } from 'src/app/services/master-data.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { RestAPIService } from 'src/app/services/restAPI.service';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { ResponseMessage } from 'src/app/Common-Modules/messages';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { TableConstants } from 'src/app/Common-Modules/table-constants';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Observable } from 'rxjs';
import { saveAs } from 'file-saver';
import { Dialog } from 'primeng/dialog';

@Component({
  selector: 'app-online-registration',
  templateUrl: './online-registration.component.html',
  styleUrls: ['./online-registration.component.css']
})
export class OnlineRegistrationComponent implements OnInit  {
  yearRange: string;
  genderOptions: SelectItem[];
  genders?: any;
  bloodGroupOptions: SelectItem[];
  bloodgroups?: any;
  motherTongueOptions: SelectItem[];
  languages?: any;
  religionOptions: SelectItem[];
  religions?: any;
  casteOptions: SelectItem[];
  castes?: any;
  schoolOptions: SelectItem[];
  schools?: any;
  districtOptions: SelectItem[];
  districts?: any;
  talukOptions: SelectItem[];
  taluks?: any;
  institutionType: string = '1';
  classOptions: SelectItem[];
  classes?: any;
  mediumOptions: SelectItem[];
  mediums?: any;
  subCasteOptions: SelectItem[];
  subcastes?: any;
  courseYearOptions: SelectItem[];
  isDisability: boolean = false;
  studentImage: any;
  incomeImg: any;
  tcImg: any;
  declarationImg: any;
  passbookImg: any;
  disableTaluk: boolean;
  ageTxt: string;
  logged_user: User;
  registeredCols: any;
  registeredDetails: any[];
  loading: boolean;
  showDialog: boolean;
  enableScholarship: boolean;
  aadharNo: string;
  aadharValidationMsg: string;
  maxDate: Date = new Date();
  existingAadhar: any;
  response: any;
  district: any;
  taluk: any;
  hostelName: any;
  distOptions: SelectItem[];
  talOptions: SelectItem[];
  hosOptions: SelectItem[];
  hostels?: any;
  hostel: any;
  hostelId: any;
  pdfDialog: boolean; 
 
  obj: OnlineRegistration = {} as OnlineRegistration;
  @BlockUI() blockUI: NgBlockUI;
  @ViewChild('f', { static: false }) _onlineRegistrationForm: NgForm;
  @ViewChild('bankPassBook', { static: false }) _bankPassBook: ElementRef;
  @ViewChild('transferCertificate', { static: false }) _transferCertificate: ElementRef;
  @ViewChild('incomeCertificate', { static: false }) _incomeCertificate: ElementRef;
  @ViewChild('userFile', { static: false }) _studentImg: ElementRef;
  @ViewChild('declarationForm', { static: false }) _declarationForm: ElementRef;
  @ViewChild('dialog', { static: false }) _dialog: Dialog;
  studentId: any;

  constructor(private _masterService: MasterService, private _d: DomSanitizer,
    private _datePipe: DatePipe, private _messageService: MessageService,
    private _restApiService: RestAPIService, private _authService: AuthService,
    private _tableConstants: TableConstants, private http: HttpClient) {
    this.blockUI.start();
    let master = new Observable<any[]>();
    master = this._masterService.initializeMaster();
    master.subscribe(response => {
      this.response = response;
    });
     }

    //  ngAfterViewInit() {
    //   document.getElementById("embedPDF").setAttribute('src', this.src);
    //  }

  ngOnInit(): void {
    const current_year = new Date().getFullYear();
    const start_year_range = current_year - 50;
    this.yearRange = start_year_range + ':' + current_year;
    this.logged_user = this._authService.UserInfo;

    this.bloodgroups = this._masterService.getMaster('BG');
    this.taluks = this._masterService.getTalukAll();
    this.genders = this._masterService.getMaster('GD');
    this.districts = this._masterService.getDistrictAll();
    this.languages = this._masterService.getMaster('MT');
    this.castes = this._masterService.getMaster('CS');
    this.classes = this._masterService.getMaster('CL');
    this.religions = this._masterService.getMaster('RL');
    this.mediums = this._masterService.getMaster('MD');
    this.subcastes = this._masterService.getMaster('SC');
    this.registeredCols = this._tableConstants.registrationColumns;
    
    setTimeout(() => {
      this.districts = this._masterService.getDistrictAll();
      this.taluks = this._masterService.getTalukAll();
      this.bloodgroups = this._masterService.getMaster('BG');
      this.genders = this._masterService.getMaster('GD');   
      this.languages = this._masterService.getMaster('MT');
      this.castes = this._masterService.getMaster('CS');
      this.classes = this._masterService.getMaster('CL');
    this.religions = this._masterService.getMaster('RL');
    this.mediums = this._masterService.getMaster('MD');
    this.subcastes = this._masterService.getMaster('SC');
      this.blockUI.stop();
    }, 500);
    this.defaultValues();
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
    let mediumSelection = [];
    let subcasteSelection = [];
    let courseYearSelection = [];
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
        if (this.obj.distrctCode !== null && this.obj.distrctCode !== undefined) {
          this.disableTaluk = false;
        } else {
          this.disableTaluk = true;
        }
        break;
      case 'TK':
        if (this.obj.distrctCode !== undefined && this.obj.distrctCode !== null) {
          this.taluks.forEach(t => {
            if (t.dcode === this.obj.distrctCode) {
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
        var courseYear = [];
        if (this.institutionType === '1') {
          filtered_data = this.classes.filter(f => {
            return f.type === 1 ; //school class name
          })
        } else {
          courseYear = this.classes.filter(c => {
            return (c.code * 1) <= 5; // college studying year
          })
          filtered_data = this.classes.filter(f => {
            return f.type === 2; //college course title
          })
        }
        filtered_data.forEach(c => {
          classSelection.push({ label: c.name, value: c.code });
        })
        courseYear.forEach(y => {
          courseYearSelection.push({ label: y.name + ' Year', value: y.code });
        })
        this.courseYearOptions = courseYearSelection;
        this.courseYearOptions.unshift({ label: '-select-', value: null });
        this.classOptions = classSelection;
        this.classOptions.unshift({ label: '-select-', value: null });
        break;
      case 'MD':
        this.mediums.forEach(m => {
          mediumSelection.push({ label: m.name, value: m.code });
        })
        this.mediumOptions = mediumSelection;
        this.mediumOptions.unshift({ label: '-select-', value: null });
        break;
      case 'SC':
        if (this.obj.caste !== null && this.obj.caste !== undefined) {
          this.subcastes.forEach(m => {
            if ((m.casteId * 1) === (this.obj.caste * 1)) {
              subcasteSelection.push({ label: m.name, value: m.code });
            }
          })
        } else {
          subcasteSelection = [];
        }
        this.subCasteOptions = subcasteSelection;
        this.subCasteOptions.unshift({ label: '-select-', value: null });
        break;
    }
  }

  refreshFields(value) {
    if (value === 'D') {
      if (this.obj.distrctCode !== null && this.obj.distrctCode !== undefined) {
        this.disableTaluk = false;
      } else {
        this.disableTaluk = true;
      }
      this._onlineRegistrationForm.form.controls['_taluk'].reset();
      this.obj.talukCode = null;
      this.talukOptions = [];
    } else if (value === 'C') {
      this._onlineRegistrationForm.form.controls['_subcaste'].reset();
      this.obj.subCaste = null;
      this.subCasteOptions = [];
    }
  }

  checkScholardhipEligibility() {
    if (this.institutionType === '1') {
      if (this.obj.classId !== undefined && this.obj.classId !== null && (this.obj.classId * 1) > 7) {
        this.enableScholarship = true;
      } else {
        this.enableScholarship = false;
        this.obj.scholarshipId = '';
      }
    } else if (this.institutionType === '0') {
      this.enableScholarship = true;
    } else {
      this.enableScholarship = false;
    }
  }

  calculateAge() {
    let timeDiff = Math.abs(Date.now() - this.obj.dob.getTime());
    let age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);
    this.obj.age = age;
    this.ageTxt = age + ' Years';
  }

  maskInput(value) {
    this.obj.aadharNo = value;
    var len = value.length;
    if (len > 11) {
      this.aadharNo = '*'.repeat(len - 4) + value.substr(8, 4);
    }
  }

  public uploadFile = (files) => {
    if (files.length === 0) {
      return;
    }
    var formData = new FormData()
    let fileToUpload: any = <File>files[0];
    let actualFilename = '';
    console.log('g',this.hostelId)
    console.log('s',this.hostelName)
    const folderName = this.hostelName + '/' + 'Documents';
    var curr_datetime =  this._datePipe.transform(new Date(), 'ddMMyyyyhmmss') + new Date().getMilliseconds();
    var etxn = (fileToUpload.name).toString().split('.');
    var filenameWithExtn = curr_datetime + '.' + etxn[1];
    const filename = fileToUpload.name + '^' + folderName + '^' + filenameWithExtn;
    formData.append('file', fileToUpload, filename);
    actualFilename = fileToUpload.name;
    console.log('file', fileToUpload, curr_datetime);
    this.http.post(this._restApiService.BASEURL + PathConstants.FileUpload_Post, formData)
      .subscribe((event: any) => {
      }
      );
      return filenameWithExtn;
  }

  onFileUpload($event, id) {
    const selectedFile = $event.target.files[0];
    var allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
    switch (id) {
      case 1:
        const s_url = window.URL.createObjectURL(selectedFile);
        this.studentImage = this._d.bypassSecurityTrustUrl(s_url);
        this.obj.studentFilename = this.uploadFile($event.target.files);
        break;
      case 2:
        const i_url = window.URL.createObjectURL(selectedFile);
        this.incomeImg = this._d.bypassSecurityTrustUrl(i_url);
        this.obj.incomeCertificateFilename = this.uploadFile($event.target.files);
        break;
      case 3:
        const t_url = window.URL.createObjectURL(selectedFile);
        this.tcImg = this._d.bypassSecurityTrustUrl(t_url);
        this.obj.tcFilename = this.uploadFile($event.target.files);
        break;
      case 4:
        const p_url = window.URL.createObjectURL(selectedFile);
        this.passbookImg = this._d.bypassSecurityTrustUrl(p_url);
        this.obj.bankPassbookFilename = this.uploadFile($event.target.files);
        break;
      case 5:
        const d_url = window.URL.createObjectURL(selectedFile);
        this.declarationImg = this._d.bypassSecurityTrustUrl(d_url);
        this.obj.declarationFilename = this.uploadFile($event.target.files);
        break;
    }

  }

  clearForm() {
    this._onlineRegistrationForm.reset();
    this._onlineRegistrationForm.form.markAsUntouched();
    this._onlineRegistrationForm.form.markAsPristine();
    this._studentImg.nativeElement.value = null;
    this._bankPassBook.nativeElement.value = null;
    this._incomeCertificate.nativeElement.value = null;
    this._transferCertificate.nativeElement.value = null;
    this._declarationForm.nativeElement.value = null;
    this.defaultValues();
  }

  defaultValues() {
    this.maxDate = new Date();
    this.obj = {} as OnlineRegistration;
    this.studentImage = '';
    this.disableTaluk = true;
    this.isDisability = false;
    this.enableScholarship = true;
    this.institutionType = '1';
    this.obj.incomeCertificateFilename = '';
    this.obj.bankPassbookFilename = '';
    this.obj.tcFilename = '';
    this.obj.studentFilename = '';
    this.obj.tcFilename = '';
    this.obj.bankPassbookFilename = '';
    this.obj.declarationFilename = '';
    this.obj.districtApproval = '0';
    this.obj.talukApproval = '0';
    this.obj.studentId = 0;
    this.obj.parentId = 0;
    this.obj.bankId = 0;
    this.obj.documentId = 0;
  }

  onSubmit() {
    this.blockUI.start();
    this.obj.dob = this._datePipe.transform(this.obj.dob, 'MM/dd/yyyy');
    this.obj.hostelId = this.hostelName;
    this.obj.motherYIncome = 0;
    this.obj.fatherYIncome = 0;
    this.obj.altMobNo = (this.obj.altMobNo !== undefined && this.obj.altMobNo !== null) ? this.obj.altMobNo : '-';
    this.obj.lastStudiedInstituteName = (this.obj.lastStudiedInstituteName !== undefined && this.obj.lastStudiedInstituteName !== null) ? this.obj.lastStudiedInstituteName : '-';
    this.obj.lastStudiedInstituteAddress = (this.obj.lastStudiedInstituteAddress !== undefined && this.obj.lastStudiedInstituteAddress !== null) ? this.obj.lastStudiedInstituteAddress : '-';
    this.obj.disabilityType = (this.obj.disabilityType !== undefined && this.obj.disabilityType !== null) ? this.obj.disabilityType : 0;
    this.obj.landmark = (this.obj.landmark !== undefined && this.obj.landmark !== null) ? this.obj.landmark : '-';
    this.obj.remarks = (this.obj.remarks !== undefined && this.obj.remarks !== null) ? this.obj.remarks : '-';
    this.obj.fatherName = (this.obj.fatherName !== undefined && this.obj.fatherName !== null) ? this.obj.fatherName : '-';
    this.obj.fatherOccupation = (this.obj.fatherOccupation !== undefined && this.obj.fatherOccupation !== null) ? this.obj.fatherOccupation : '-';
    this.obj.fatherQualification = (this.obj.fatherQualification !== undefined && this.obj.fatherQualification !== null) ? this.obj.fatherQualification : '-';
    this.obj.fatherMoileNo = (this.obj.fatherMoileNo !== undefined && this.obj.fatherMoileNo !== null) ? this.obj.fatherMoileNo : '-';
    this.obj.motherName = (this.obj.motherName !== undefined && this.obj.motherName !== null) ? this.obj.motherName : '-';
    this.obj.motherQualification = (this.obj.motherQualification !== undefined && this.obj.motherQualification !== null) ? this.obj.motherQualification : '-';
    this.obj.motherOccupation = (this.obj.motherOccupation !== undefined && this.obj.motherOccupation !== null) ? this.obj.motherOccupation : '-';
    this.obj.motherMoileNo = (this.obj.motherMoileNo !== undefined && this.obj.motherMoileNo !== null) ? this.obj.motherMoileNo : '-';
    // this.obj.medium = (this.obj.medium !== undefined && this.obj.medium !== null) ? this.obj.medium : 0;
    this.obj.courseTitle = (this.obj.courseTitle !== undefined && this.obj.courseTitle !== null) ? this.obj.courseTitle : '-';
    this.obj.scholarshipId = (this.obj.scholarshipId !== undefined) ? this.obj.scholarshipId : '';
    this.obj.micrNo = (this.obj.micrNo !== undefined && this.obj.micrNo !== null) ? this.obj.micrNo : '';
    this.obj.branchName = (this.obj.branchName !== undefined && this.obj.branchName !== null) ? this.obj.branchName : '-';
    this.obj.courseYearId = (this.institutionType === '1') ? 1 : (this.obj.courseYearId !== undefined && this.obj.courseYearId !== null) ? this.obj.courseYearId : 1;
    this.obj.village = (this.obj.village !== undefined && this.obj.village !== null) ? this.obj.village : '-';
    this.obj.guardianName = (this.obj.guardianName !== undefined && this.obj.guardianName !== null) ? this.obj.guardianName : '-';
    this.obj.guardianQualification = (this.obj.guardianQualification !== undefined && this.obj.guardianQualification !== null) ? this.obj.guardianQualification : '-';
    this.obj.guardianOccupation = (this.obj.guardianOccupation !== undefined && this.obj.guardianOccupation !== null) ? this.obj.guardianOccupation : '-';
    this.obj.guardianMobileNo = (this.obj.guardianMobileNo !== undefined && this.obj.guardianMobileNo !== null) ? this.obj.guardianMobileNo : '-';

    this._restApiService.post(PathConstants.OnlineStudentRegistration_Post, this.obj).subscribe(response => {
      if (response !== undefined && response !== null) {
        if (response) {
          this.blockUI.stop();
          this.onView();
          // this.clearForm();          
          this._messageService.clear();
          this._messageService.add({
            key: 'd-msg', severity: ResponseMessage.SEVERITY_SUCCESS,
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

  onView() {
    this.showDialog = true;
    this.registeredDetails = [];
    this.loading = true;
    const params = {
      'AadharNo': this.obj.aadharNo,
      'MobileNo': this.obj.mobileNo,
      'Dob': this._datePipe.transform(this.obj.dob, 'MM/dd/yyyy')
    }
    this._restApiService.getByParameters(PathConstants.OnlineStudentRegistration_Get, params).subscribe(res => {
      if (res !== undefined && res !== null && res.length !== 0) {
        res.forEach(r => {
          this.studentId = r.studentId;
          this.hostelId = r.hostelId;
          var len = r.aadharNo.toString().length;
          if (len > 11) {
            r.aadharNoMasked = '*'.repeat(len - 4) + r.aadharNo.substr(8, 4);
          }
        })
        console.log('S',this.studentId)
        console.log('H',this.hostelId)
        this.registeredDetails = res.slice(0);
        this.loading = false;
      } else {
        this.loading = false;
        this._messageService.clear();
        this._messageService.add({
          key: 'd-msg', severity: ResponseMessage.SEVERITY_WARNING,
          summary: ResponseMessage.SUMMARY_WARNING, detail: ResponseMessage.NoRecordMessage
        })
      }
    })
  }

  onEdit(row, index) {
    if (row !== undefined && row !== null) {
      this.obj = null;
      this.showDialog = false;
      this.obj = row;
      this.classOptions = [{ label: row.class, value: row.classId }];
      this.casteOptions = [{ label: row.casteName, value: row.caste }];
      this.talukOptions = [{ label: row.Talukname, value: row.talukCode }];
      this.genderOptions = [{ label: row.genderName, value: row.gender }];
      this.districtOptions = [{ label: row.Districtname, value: row.distrctCode }];
      this.religionOptions = [{ label: row.religionName, value: row.religion }];
      this.motherTongueOptions = [{ label: row.mothertongueName, value: row.motherTongue }];
      this.bloodGroupOptions = [{ label: row.bloodgroupName, value: row.bloodGroup }];
      this.mediumOptions = [{ label: row.mediumName, value: row.medium }];
      this.subCasteOptions = [{ label: row.subcasteName, value: row.subCaste }];
      this.courseYearOptions = [{ label: row.courseYear + ' Year', value: row.courseYearId }];
      this.obj.dob = new Date(row.dob);
      this.ageTxt = this.obj.age + ' Years';
      this.institutionType = ((row.classId * 1) > 12) ? '0' : '1';
      this.studentImage = 'assets/layout/'+ this.logged_user.hostelId +'/Documents/'+ row.studentFilename;
      this.maskInput(this.obj.aadharNo);
    }
  }

  onDelete(row, index) {

  }

  validateAadhaar(aadhaarString) {
    // The multiplication table
    if (aadhaarString.length != 12) {
      this.aadharValidationMsg = 'Aadhaar numbers should be 12 digits !';
    } else {
      this.aadharValidationMsg = '';
    }
    if (aadhaarString.match(/[^$,.\d]/)) {
      this.aadharValidationMsg = 'Aadhaar numbers must contain only numbers !';
    } else {
      this.aadharValidationMsg = '';
    }
    var aadhaarArray = aadhaarString.split('');
    var toCheckChecksum = aadhaarArray.pop();
    if (this.generate(aadhaarArray) == toCheckChecksum) {
      this.aadharValidationMsg = '';
      this.maskInput(aadhaarString)
      return true;
    } else {
      this.aadharValidationMsg = 'Invalid Aadhar No!';
      this._onlineRegistrationForm.form.controls._aadharno.invalid;
      if (this.aadharNo.length === 12) {
        setTimeout(() => {
          this.aadharNo = null;
          this.aadharValidationMsg = 'Please enter valid Aadhar No!';
    }, 300);
      }
      return false;
    }
  }

  // generates checksum
  generate(array) {
    var d = [
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
      [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
      [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
      [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
      [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
      [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
      [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
      [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
      [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
    ];
    // permutation table p
    var p = [
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
      [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
      [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
      [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
      [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
      [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
      [7, 0, 4, 6, 9, 1, 3, 2, 5, 8]
    ];
    // inverse table inv
    var inv = [0, 4, 3, 2, 1, 5, 6, 7, 8, 9];
    var c = 0;
    var invertedArray = array.reverse();
    for (var i = 0; i < invertedArray.length; i++) {
      c = d[c][p[((i + 1) % 8)][invertedArray[i]]];
    }
    return inv[c];
  }

  checkAadhar() {
    const params = {
      'AadharNo': this.obj.aadharNo,
      'studentId': this.obj.studentId
    }
    this._restApiService.getByParameters(PathConstants.AadharCheck_Get, params).subscribe(res => {
      if ( res.Table.length === 0) { 
        this.onSubmit();
      } else {
        this._messageService.clear();
        this._messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
          summary: ResponseMessage.SUMMARY_ERROR, detail: 'Aadhar number is already exist'
        })
      }
    });
  }

  onHostelSelect(value) {
    let districtSelection = [];
    let talukSelection = [];
      switch (value) {
        case 'D':
          this.districts.forEach(d => {
            districtSelection.push({ label: d.name, value: d.code });
          })
          this.distOptions = districtSelection;
          this.distOptions.unshift({ label: '-select-', value: 'null' });
          break;
        case 'T':
            this.taluks.forEach(t => {
              if (t.dcode === this.district) {
                talukSelection.push({ label: t.name, value: t.code });
              }
            })
            this.talOptions = talukSelection;
            this.talOptions .unshift({ label: '-select-', value: 'null' });
          break;
      } 
}

refreshField(value) {
  if(value === 'D') {
    this.taluk = null;
    this.talukOptions = [];
  }
    this.loadHostelList();
}

loadHostelList() {
  this.hostel = null;
  this.hosOptions = [];
  let hostelSelection = [];
  const params = {
    'DCode': this.district,
    'TCode': this.taluk,
  }
  if (this.district !== null && this.district !== undefined && this.district !== 'All' &&
  this.taluk !== null && this.taluk !== undefined && this.taluk !== 'All') {
    this._restApiService.getByParameters(PathConstants.Hostel_Get, params).subscribe(res => {
      if (res !== null && res !== undefined && res.length !== 0) {
        this.hostels = res.Table;
        this.hostels.forEach(h => {
          hostelSelection.push({ label: h.HostelName, value: h.Slno });
        })
      }
    })
  }
  this.hosOptions = hostelSelection;
  this.hosOptions.unshift({ label: '-select-', value: null });
  
}

onDownload(Filename) {
  this.pdfDialog = true;
  // document.getElementById("embedPDF").setAttribute('src', this.src);
}
onDialogShow() {
  var src = 'assets/layout/Reports/' + this.hostelId+ '/' + this.obj.aadharNo + '_' + this.studentId + '.pdf';
  document.getElementById("embedPDF").setAttribute('src', src);
  console.log('H',this.hostelId)
  console.log('A',this.obj.aadharNo)
  console.log('s',this.studentId)
}
}

