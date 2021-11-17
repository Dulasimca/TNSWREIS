import { Component, OnInit } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { LocationService } from 'src/app/services/location.service';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import { RestAPIService } from 'src/app/services/restAPI.service';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { User } from 'src/app/Interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { MasterService } from 'src/app/services/master-data.service';
import {​​​​​​​​​ DatePipe }​​​​​​​​​ from'@angular/common';
import { ResponseMessage } from 'src/app/Common-Modules/messages';



@Component({
  selector: 'app-attendance-image',
  templateUrl: './attendance-image.component.html',
  styleUrls: ['./attendance-image.component.css']
})
export class AttendanceImageComponent implements OnInit {
  date: Date = new Date();
  districts : any;
  districtname: any;
  DistrictId : number; 
  HostelId : number;
  taluks : any;
  TalukId : number
  talukname: string;
  hostelname: string;
  remarks: any;
  openCamera: boolean;
  location: any;
  login_user: User;
  public errors: WebcamInitError[] = [];
  private trigger: Subject<void> = new Subject<void>();
  hostelName: any;
  Districtcode: any;
  data: any;
  NoOfStudent:number;
  AttendanceId:number;
  uploadimage: any;
  Slno: any;
  cols: any;
  showDialog: boolean;
  hostelImage : string;
  constructor(private _locationService: LocationService,private restApiService: RestAPIService,private _authService: AuthService, private masterService: MasterService,private datepipe: DatePipe
  ,private _messageService: MessageService  ) { }
  
  ngOnInit(): void {
    this.cols = [
      { field: 'DistrictName', header: 'District', width: '100px'},
      { field: 'TalukName', header: 'Taluk', width: '100px'},
      { field: 'HostelName', header: 'Hostel', width: '100px'},
      { field: 'Uploaddate', header: 'Date', width: '100px'},
      { field: 'Remarks', header: 'Remarks', width: '100px'},
    ];
    this.Slno = 0;
    this.NoOfStudent=0;
    this.login_user = this._authService.UserInfo;
    this.districts = this.masterService.getMaster('DT');
    this.taluks = this.masterService.getMaster('TK');
    this.login_user = this._authService.UserInfo;
    this.hostelname =this.login_user.hostelName;
    this.HostelId = this.login_user.hostelId;
    this.DistrictId = this.login_user.districtCode;
    this.TalukId = this.login_user.talukId;
    this.districts.forEach(d => {
      if(this.DistrictId==d.code)
      {
        this.districtname=d.name
      }
    });
    this.taluks.forEach(d => {
      if(this.TalukId==d.code)
      {
        this.talukname=d.name
      }
    });
    this._locationService.getLocation();
  }
  public webcamImage: WebcamImage = null;
  onSubmit() {
    const params = {
      'Slno': this.Slno != undefined ? this.Slno : 0,
      'Id': 0, 
      'Uploaddate': this.datepipe.transform(this.date,'MM/dd/yyyy'), 
      'Districtcode': this.DistrictId, 
      'Talukid': this.TalukId, 
      'HostelID': this.HostelId, 
      'AttendanceId': this.AttendanceId,
      'Remarks': this.remarks, 
      'Latitute': this.location[0],
      'Longitude': this.location[1],
      'uploadImage': this.webcamImage,
      'Flag': 1, 
    }
      this.restApiService.post(PathConstants.AttendanceImage_Post,params).subscribe(res=> {​​​​​​​​​
          if (res) {
        //  this.blockUI.stop();
        //  this.onClear();
         this._messageService.clear();
         this._messageService.add({
           key: 't-msg', severity: ResponseMessage.SEVERITY_SUCCESS,
        summary: ResponseMessage.SUMMARY_SUCCESS, detail: ResponseMessage.SuccessMessage
      });
    }
  });
}
  GetAttendanceInfo()
  {
    this.NoOfStudent=0;
    const params={​​​​​​​​​
    'HostelID' :this.HostelId != undefined && this.HostelId != null ? this.HostelId : 0, 
    'Districtcode' :this.DistrictId != undefined && this.DistrictId != null ? this.DistrictId : 0 ,
    'Talukid'    :this.TalukId != undefined && this.TalukId != null ? this.TalukId : 0 ,
    'FromDate'    :this.datepipe.transform(this.date,'MM/dd/yyyy'), 
    'Todate'   :this.datepipe.transform(this.date,'MM/dd/yyyy')
        }​​​​​​​​​
    this.restApiService.getByParameters(PathConstants.Attendance_Get,params).subscribe(res=> {​​​​​​​​​
         if(res !== null && res !== undefined && res.length !==0) {​​​​​​​​​
          res.Table.forEach(element => {
            console.log(element.NOOfStudent);
            this.NoOfStudent = element.NOOfStudent;
            this.AttendanceId = element.Id
          });;
         }​​​​​​​​​
         else{
          this.NoOfStudent=0;
          this.AttendanceId=0;
         }
   
       }​​​​​​​​​);
    
    

  }
  onView() {
    const params={
      'HostelID' : this.HostelId, 
     'Districtcode' : this.DistrictId ,
     'Talukid'    :this.TalukId,
    'FromDate'    :this.datepipe.transform(this.date,'MM/dd/yyyy'), 
     'Todate'   :this.datepipe.transform(this.date,'MM/dd/yyyy'), 
    }
    this.restApiService.getByParameters(PathConstants.AttendanceImage_Get,params).subscribe(res => {
      if(res !== null && res !== undefined && res.length !==0) {
        res.Table.forEach(i => {
          i.url = 'assets/layout/'+i.HostelID +'/' + i.ImageName;
        })
        this.data = res.Table;
      }
      else{
        this._messageService.clear();
        this._messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_WARNING,
          summary: ResponseMessage.SUMMARY_ALERT, detail: ResponseMessage.SelectUploadDate
        });
      }
      
    });
  }
  
  showImage(url) {
    this.showDialog = true;
    this.hostelImage = url;
  }

  camera() {
    this.openCamera = true;
    this.location = this._locationService.getLocation();
  }
  capture() {
    this.captureImage();
  }

  captureImage() {
    this.trigger.next();
  }
  public triggerSnapshot(): void {
    this.trigger.next();
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }
  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }
  handleImage(webcamImage: WebcamImage) {
    this.webcamImage = webcamImage;
      var byteString = atob(this.webcamImage.imageAsDataUrl.split(',')[1]);
      var ab = new ArrayBuffer(byteString.length);
      var ia = new Uint8Array(ab);
      for (var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
      }
    this.openCamera = false;
 
}
onRowSelect(event, selectedRow) {

}
}
