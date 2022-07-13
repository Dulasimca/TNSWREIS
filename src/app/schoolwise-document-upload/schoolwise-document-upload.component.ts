import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
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
  hostel: any;;
  hostelOptions: SelectItem[];
  hostels?: any
  schoolSelection: any[] = [];
  filteredSchoolData: any[] = [];
  Filename: string;
  logged_user: User;
  institutes?: any;
  instituteOptions: SelectItem[];

  constructor(private _restApiService: RestAPIService, private _messageService: MessageService, private _masterService: MasterService
    ,private _datePipe: DatePipe,private http: HttpClient) { }

  ngOnInit(): void {
    this.districts = this._masterService.getMaster('DT');
    // this.loadInstitute();
    const params = {
      'HCode' : 55
    }
    this._restApiService.getByParameters(PathConstants.RegisteredHostelWiseInstitute_Get, params).subscribe(res => {
      this.institutes = res.table;
    })
    }

  public uploadFile = (files) => {
    if (files.length === 0) {
      return;
    }
    var formData = new FormData()
    let fileToUpload: any = <File>files[0];
    let actualFilename = '';
    const folderName = 111+ '/' + 'Documents';
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
  reloadFields(type) {

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

  }

  onView() {

  }
  loadTable() {

  }

}
