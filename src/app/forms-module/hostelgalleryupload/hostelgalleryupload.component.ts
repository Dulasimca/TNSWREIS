import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { AuthGuard } from 'src/app/services/auth.guard';
import { RestAPIService } from 'src/app/services/restAPI.service';
import { User } from 'src/app/Interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { ResponseMessage } from 'src/app/Common-Modules/messages';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { MasterService } from '../../services/master-data.service';
import { TableConstants } from 'src/app/Common-Modules/table-constants';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-hostelgalleryupload',
  templateUrl: './hostelgalleryupload.component.html',
  styleUrls: ['./hostelgalleryupload.component.css']
})
export class HostelgalleryuploadComponent implements OnInit {
  Hostelactivityimages: any;
  yearOptions: SelectItem[];
  year: any;
  years?: any;
  imagefilenam: any;
  logged_user: User;
  title: any;
  date: Date = new Date();
  hostelGallerycols: any;
  hostelGallerydata: any[] = [];
  imageDialog: boolean;
  loading: boolean;
  @ViewChild('f', { static: false }) hostelImageUpload: NgForm;
  @ViewChild('userFile', { static: false }) _HostelImg: ElementRef;
  @ViewChild('cd', { static: false }) _alert: ConfirmDialog;
  public formData = new FormData();
  ImageId: any;

  constructor(private _tableConstants: TableConstants, private masterService: MasterService, private _restApiService: RestAPIService, private messageService: MessageService, private _d: DomSanitizer,
    private _AuthGuard: AuthGuard, private _authService: AuthService, private http: HttpClient, private _datePipe: DatePipe,  private _confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    this.hostelGallerycols = this._tableConstants.hostelGalleryUploadColumns;
    this.ImageId = 0;
    this.logged_user = this._authService.UserInfo;
    this.years = this.masterService.getMaster('AY');
  }
  onSelect(type) {
    let yearSelection = [];
    switch (type) {
      case 'Y':
        var filtered_data = [];
        filtered_data = this.years.filter(y => {
          return y.type === 1;
        })
        filtered_data.forEach(y => {
          yearSelection.push({ label: y.name, value: y.code });
        })
        console.log('t', this.years)
        this.yearOptions = yearSelection;
        this.yearOptions.unshift({ label: '-select', value: null });
        break;
    }
  }

  public uploadFile = (event) => {
    const selectedFile = event.target.files[0];
    {
      const url = window.URL.createObjectURL(selectedFile);
      this.Hostelactivityimages = this._d.bypassSecurityTrustUrl(url);
    }
    this.formData = new FormData()
    let fileToUpload: any = <File>event.target.files[0];
    const folderName = this.logged_user.hostelId + '/' + 'Events' + '/' + '2021-2022';
    var curr_datetime =  this._datePipe.transform(new Date(), 'ddMMyyyyhmmss') + new Date().getMilliseconds();
    var etxn = (fileToUpload.name).toString().split('.');
    var filenameWithExtn = curr_datetime + '.' + etxn[1];
    const filename = fileToUpload.name + '^' + folderName + '^' + filenameWithExtn;
    this.formData.append('file', fileToUpload, filename);
    this.imagefilenam = filenameWithExtn;
    this.http.post(this._restApiService.BASEURL + PathConstants.FileUpload_Post, this.formData)
      .subscribe(event => {
      }
      );
      return filenameWithExtn;
  }

  onSubmit() {
    // this.uploadFile(this.imagefilenam)
    const params = {
      'Id ': this.ImageId,
      'DCode': this.logged_user.districtCode,
      'TCode': this.logged_user.talukId,
      'HCode': this.logged_user.hostelId,
      'AccYear': this.year,
      'ImageTitle': this.title,
      'Image': this.imagefilenam,
      'Flag': 1
    }
    this._restApiService.post(PathConstants.HostelGallery_Post, params).subscribe(res => {
      console.log('rs', res)
    })
    this.messageService.clear();
    this.messageService.add({
      key: 't-msg', severity: ResponseMessage.SEVERITY_SUCCESS,
      summary: ResponseMessage.SUMMARY_SUCCESS, detail: ResponseMessage.SuccessMessage
    });
  }
  clearForm() {
    this.hostelImageUpload.reset();
  }
  // defaultValues() {
  //   this.Hostelactivityimages = 'assets/layout/' + this.logged_user.hostelId + '/Documents/' + 'Mohan.jpg';
  //   this.imagefilenam = '';
  // }

  showImage(url) {
    this.imageDialog = true;
    this.Hostelactivityimages = url;
  }

  loadTable() {
    const params = {
      'HCode' : this.logged_user.hostelId,
       }
    this._restApiService.getByParameters(PathConstants.HostelGallery_Get, params).subscribe(res => {
      if (res !== null && res !== undefined && res.length !== 0) {
        res.Table.forEach(i => {
          i.url = 'assets/layout/' + this.logged_user.hostelId + '/Events' + '/' + '2021-2022' + '/' + i.Image;
        })
        this.hostelGallerydata = res.Table;
        this.loading = false;
      } else {
        this.loading = false;
        this.messageService.clear();
        this.messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_WARNING,
          summary: ResponseMessage.SUMMARY_WARNING, detail: ResponseMessage.NoRecordMessage
        })
      }
    });
  }

  onDelete(rowData) { 
    this._confirmationService.confirm({
      message: 'Are you sure that you want to delete?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this._alert.disableModality();
        // this.blockUI.start();
        this._restApiService.post(PathConstants.UpdateHostelGallery_Put, { 'ImageId': rowData.Id }).subscribe(res => {
    console.log('enter')

          if (res !== null && res !== undefined) {
            this.loadTable();
            // this.blockUI.stop;
            this.messageService.clear();
            this.messageService.add({
              key: 't-msg', severity: ResponseMessage.SEVERITY_SUCCESS,
              summary: ResponseMessage.SUMMARY_SUCCESS, detail: ResponseMessage.DeleteSuccessMsg
            });
          } else {
            // this.blockUI.start();
            this.messageService.clear();
            this.messageService.add({
              key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
              summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.DeleteFailMsg
            });
          }
        })
      },
      reject: () => {
        this.messageService.clear();
        this._alert.disableModality();
      }
    })
  }
    
}



