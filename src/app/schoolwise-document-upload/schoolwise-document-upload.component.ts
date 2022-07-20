import { DatePipe } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { ResponseMessage } from '../Common-Modules/messages';
import { PathConstants } from '../Common-Modules/PathConstants';
import { User } from '../interfaces/user';
import { MasterService } from '../services/master-data.service';
import { RestAPIService } from '../services/restAPI.service';

@Component({
  selector: 'app-schoolwise-document-upload',
  templateUrl: './schoolwise-document-upload.component.html',
  styleUrls: ['./schoolwise-document-upload.component.css']
})
export class SchoolwiseDocumentUploadComponent implements OnInit {

  district: number;
  districtOptions: SelectItem[];
  districts: any;
  school: any;
  schoolOptions: SelectItem[];
  hostel: any;
  id: any;
  loading: boolean;
  hostelOptions: SelectItem[];
  hostels?: any
  schoolSelection: any[] = [];
  filteredSchoolData: any[] = [];
  Filename: string;
  logged_user: User;
  institutes?: any;
  instituteOptions: SelectItem[];
  institute: any;
  data: any = [];

  constructor(private _restApiService: RestAPIService, private _messageService: MessageService, private _masterService: MasterService
    , private _datePipe: DatePipe, private http: HttpClient) { }

  ngOnInit(): void {
    this.districts = this._masterService.getMaster('DT');
    this.id = 0;
    // this.loadInstitute();

  }
  loadInstitues() {
    if (this.hostel !== null && this.hostel !== undefined) {
      const params = {
        'HCode': this.hostel
      }
      this._restApiService.getByParameters(PathConstants.RegisteredHostelWiseInstitute_Get, params).subscribe(res => {
        this.institutes = res;

      })
    }
  }

  public uploadFile = (files) => {
    if (files.length === 0) {
      return;
    }
    var formData = new FormData()
    let fileToUpload: any = <File>files[0];
    let actualFilename = '';
    const folderName = this.hostel + '/' + 'Documents';
    var curr_datetime = this._datePipe.transform(new Date(), 'ddMMyyyyhmmss') + new Date().getMilliseconds();
    var etxn = (fileToUpload.name).toString().split('.');
    var filenameWithExtn = curr_datetime + '.' + etxn[1];
    const filename = fileToUpload.name + '^' + folderName + '^' + filenameWithExtn;
    formData.append('file', fileToUpload, filename);
    actualFilename = fileToUpload.name;
    this.http.post(this._restApiService.BASEURL + PathConstants.FileUpload_Post, formData)
      .subscribe((event: any) => {
      }
      );
    return filenameWithExtn;
  }
  onFileUpload($event) {
    const selectedFile = $event.target.files[0];
    var allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
    const s_url = window.URL.createObjectURL(selectedFile);
    // this.studentImage = this._d.bypassSecurityTrustUrl(s_url);
    this.Filename = this.uploadFile($event.target.files);
  }

  onSelect(value) {
    let districtSelection = [];
    let instituteSelection = [];

    switch (value) {
      case 'D':
        this.districts.forEach(d => {
          districtSelection.push({ label: d.name, value: d.code });
        })
        this.districtOptions = districtSelection;

        this.districtOptions.unshift({ label: '-select-', value: null });
        break;
      case 'IN':
        this.institutes.forEach(n => {
          instituteSelection.push({ label: n.InstituteName, value: n.CurrentInstituteId })
        });
        this.instituteOptions = instituteSelection;
        this.instituteOptions.unshift({ label: '-select', value: null });
        break;
    }
  }
  reloadFields(value) {
    if (value === 'H') {
      this.institute = null;
      this.instituteOptions = [];
    }
    this.loadInstitues();
  }
  onSelectType() {
    this.schoolOptions = [];
    this.filteredSchoolData.length = 0;
    this.filteredSchoolData = this.schoolSelection.filter(s => {
      return s.type === 1;
    })
  }


  selectDistrict() {
    this.hostel = null;
    this.hostelOptions = [];
    let hostelSelection = [];
    const params = {
      'Type': 1,
      'DCode': this.district,
      'TCode': 0,
      'HostelId': 0,
    }
    if (this.district !== null && this.district !== undefined) {
      this._restApiService.getByParameters(PathConstants.Hostel_Get, params).subscribe(res => {
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

  onSubmit() {
    const params = {
      'Id': this.id,
      'DCode': this.district,
      'HCode': this.hostel,
      'ICode': this.institute,
      'Filename': this.Filename,
      'Flag': 1
    }
    this._restApiService.post(PathConstants.SchoolwiseDocUpload_Post, params).subscribe(res => {
      if (res) {
        // this.onClear();
        this.onView();
        this._messageService.clear();
        this._messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_SUCCESS,
          summary: ResponseMessage.SUMMARY_SUCCESS, detail: ResponseMessage.SuccessMessage
        });
      } else {
        this._messageService.clear();
        this._messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
          summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.ErrorMessage
        });
      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 0 || err.status === 400) {
        this._messageService.clear();
        this._messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
          summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.ErrorMessage
        })
      }
    })
  }

  onEdit(rowData) {
    this.id = rowData.Id;
    this.Filename = rowData.DocumentFilenaame;
    this.institute = rowData.InstituteId;
    this.instituteOptions = [{ label: rowData.InstituteName, value: rowData.InstituteId }];
    this.district = rowData.DistrictCode;
    this.districtOptions = [{ label: rowData.Districtname, value: rowData.DistrictCode }];
    this.hostel = rowData.HostelId;
    this.hostelOptions = [{ label: rowData.HostelName, value: rowData.HostelId }];
  }

  onView() {
    this.loading = true;
    this._restApiService.get(PathConstants.SchoolwiseDocUpload_Get).subscribe(res => {
      if (res !== null && res !== undefined) {
        if(res.length !== 0){
        this.data = res;
        this.loading = false;
      } 
      else {
        this.loading = false;
        this._messageService.clear();
        this._messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_WARNING,
          summary: ResponseMessage.SUMMARY_ALERT, detail: ResponseMessage.NoRecordMessage
        })
      }
    }else {
        this.loading = false;
        this._messageService.clear();
        this._messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
          summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.ErrorMessage
        })
      }
    })

  }

  loadTable() {

  }

}
