import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { MessageService, SelectItem } from 'primeng/api';
import { Registration } from 'src/app/interfaces/registration';
import { User } from 'src/app/interfaces/user';
import { MasterService } from 'src/app/services/master-data.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { RestAPIService } from 'src/app/services/restAPI.service';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { ResponseMessage } from 'src/app/Common-Modules/messages';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { TableConstants } from 'src/app/Common-Modules/table-constants';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
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
  registeredDetails: any[] = [];
  loading: boolean;
  showDialog: boolean;
  maxDate: Date = new Date();
  obj: Registration = {} as Registration;
  @BlockUI() blockUI: NgBlockUI;
  @ViewChild('f', { static: false }) _registrationForm: NgForm;
  @ViewChild('bankPassBook', { static: false }) _bankPassBook: ElementRef;
  @ViewChild('transferCertificate', { static: false }) _transferCertificate: ElementRef;
  @ViewChild('incomeCertificate', { static: false }) _incomeCertificate: ElementRef;
  @ViewChild('userFile', { static: false }) _studentImg: ElementRef;
  @ViewChild('declarationForm', { static: false }) _declarationForm: ElementRef;

  constructor(private _masterService: MasterService, private _d: DomSanitizer,
    private _datePipe: DatePipe, private _messageService: MessageService,
    private _restApiService: RestAPIService, private _authService: AuthService,
    private _tableConstants: TableConstants, private http: HttpClient) { }

  ngOnInit(): void {
    const current_year = new Date().getFullYear();
    const start_year_range = current_year - 30;
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
      case 'MD':
        this.mediums.forEach(m => {
          mediumSelection.push({ label: m.name, value: m.code });
        })
        this.mediumOptions = mediumSelection;
        this.mediumOptions.unshift({ label: '-select-', value: null });
        break;
      case 'SC':
        if(this.obj.caste !== null && this.obj.caste !== undefined) {
        this.subcastes.forEach(m => {
          if((m.casteId * 1) === (this.obj.caste * 1)) {
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
    if(value === 'D') {
      if(this.obj.distrctCode !== null && this.obj.distrctCode !== undefined) {
      this.disableTaluk = false;
      } else {
        this.disableTaluk = true;
      }
      this._registrationForm.form.controls['_taluk'].reset();
      this.obj.talukCode = null;
      this.talukOptions = [];
    }
  }

  calculateAge() {
    let timeDiff = Math.abs(Date.now() - this.obj.dob.getTime());
    let age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);
    this.obj.age = age;
    this.ageTxt = age + ' Years';
  }

  public uploadFile = (files) => {
    if (files.length === 0) {
      return;
    }
    var formData = new FormData()
    let fileToUpload: any = <File>files[0];
    let actualFilename = '';
    const folderName = this.logged_user.hostelId + '/' + 'Documents';
    const filename = fileToUpload.name + '^' + folderName;
    formData.append('file', fileToUpload, filename);
    actualFilename = fileToUpload.name;
    this.http.post(this._restApiService.BASEURL + PathConstants.FileUpload_Post, formData)
      .subscribe((event: any) => {
      }
      );
    return actualFilename;
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
    this._registrationForm.reset();
    this._registrationForm.form.markAsUntouched();
    this._registrationForm.form.markAsPristine();
    this._studentImg.nativeElement.value = null;
    this._bankPassBook.nativeElement.value = null;
    this._incomeCertificate.nativeElement.value = null;
    this._transferCertificate.nativeElement.value = null;
    this._declarationForm.nativeElement.value = null;
    this.defaultValues();
  }

  defaultValues() {
    this.maxDate = new Date();
    this.obj = {} as Registration;
    this.studentImage = '';
    this.disableTaluk = true;
    this.isDisability = false;
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
    this.obj.hostelId = this.logged_user.hostelId;
    this._restApiService.post(PathConstants.Registration_Post, this.obj).subscribe(response => {
      if (response !== undefined && response !== null) {
        if (response) {
          this.blockUI.stop();
          this.clearForm();
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

  onView() {
    this.showDialog = true;
    this.registeredDetails = [];
    this.loading = true;
    const params = {
      'DCode': this.logged_user.districtCode,
      'TCode': this.logged_user.talukId,
      'HCode': this.logged_user.hostelId
    }
    this._restApiService.getByParameters(PathConstants.Registration_Get, params).subscribe(res => {
      if (res !== undefined && res !== null && res.length !== 0) {
        this.registeredDetails = res.slice(0);
        this.loading = false;
      } else {
        this.loading = false;
        this._messageService.clear();
        this._messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_WARNING,
          summary: ResponseMessage.SUMMARY_WARNING, detail: ResponseMessage.NoRecordMessage
        })
      }
    })
  }

  onEdit(row, index) {
    if (row !== undefined && row !== null) {
      this.showDialog = false;
      this.registeredDetails.forEach(detail => {
        this.obj = detail;
        this.classOptions = [{ label: detail.class, value: detail.classId }];
        this.casteOptions = [{ label: detail.casteName, value: detail.caste }];
        this.talukOptions = [{ label: detail.Talukname, value: detail.talukCode }];
        this.genderOptions = [{ label: detail.genderName, value: detail.gender }];
        this.districtOptions = [{ label: detail.Districtname, value: detail.distrctCode }];
        this.religionOptions = [{ label: detail.religionName, value: detail.religion }];
        this.motherTongueOptions = [{ label: detail.mothertongueName, value: detail.motherTongue }];
        this.bloodGroupOptions = [{ label: detail.bloodgroupName, value: detail.bloodGroup }];
        this.obj.dob = new Date(detail.dob);
        this.ageTxt = this.obj.age + ' Years';
        this.studentImage = 'assets/layout' + this.logged_user.hostelId + '/' + 'Documents/' + detail.studentFilename;
      })
    }
  }

  onDelete(row, index) {

  }
}
