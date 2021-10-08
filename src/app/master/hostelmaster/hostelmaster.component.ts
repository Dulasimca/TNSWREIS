import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { HttpClient } from '@angular/common/http';






import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { RestAPIService } from 'src/app/services/restAPI.service';
import { MasterService } from 'src/app/services/master-data.service';
import {WebcamImage, WebcamInitError, WebcamUtil} from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';


@Component({
  selector: 'app-hostelmaster',
  templateUrl: './hostelmaster.component.html',
  styleUrls: ['./hostelmaster.component.css']
})
export class HostelmasterComponent implements OnInit {
 
  Hostelname: string;
  Hosteltamilname: string;
  Hosteltype: any;
  Hosteltypes?: any;
  HosteltypeOptions: SelectItem[];
  DistrictcodeOptions: SelectItem[];
  Districtcode: any;
  Districtcodes?: any;
  TalukId: any;
  TalukIds?: any;
  TalukIdOptions: SelectItem[];
  Buildingno: any;
  Street: any;
  Landmark: string;
  upload: any;
  pincode: any;
  Longitude: any;
  Latitude: any;
  Radius: any;
  Totalstudent: any;
  mobileNo: any;
  daysOptions: SelectItem[];
  masterData?: any = [];
  days?: any = [];
  data?: any = [];
  Table2?: any;
  Slno: any;
  openCamera: boolean;
  public errors: WebcamInitError[] = [];
  private trigger: Subject<void> = new Subject<void>();

  constructor(private http: HttpClient, private restApiService: RestAPIService,
    private masterService: MasterService) { }

  public ngOnInit(): void {

    this.Districtcodes = this.masterService.getMaster('DT');
    console.log('hostel', this.Districtcodes);
    this.Hosteltypes = this.masterService.getMaster('HT');
    console.log('hostel', this.Hosteltypes);

    this.TalukIds = this.masterService.getMaster('TK');
    this.Slno = 0;
  }
  public webcamImage: WebcamImage = null;

  handleImage(webcamImage: WebcamImage) {
    this.webcamImage = webcamImage;
    this.openCamera= false;
    console.log('handle', this.webcamImage);
  }
  public triggerSnapshot(): void {
    this.trigger.next();
  }

  public get triggerObservable(): Observable<void> {
    console.log('trigger', this.trigger);
    return this.trigger.asObservable();
  }

  
  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }

  onSelect(type) {
    let hostelSelection = [];
    let districtSelection = [];
    let talukSelection = [];
    this.masterData = [];
    switch (type) {   
      case 'HT':
        this.Hosteltypes.forEach(h => {
          hostelSelection.push({ label: h.name, code: h.code });
        });
        this.HosteltypeOptions = hostelSelection;
        break;
      case 'D':
        this.Districtcodes.forEach(d => {
          districtSelection.push({ label: d.name, value: d.code });
        });
        this.DistrictcodeOptions = districtSelection;
        break;
      case 'TK':
        this.TalukIds.forEach(t => {
          talukSelection.push({ label: t.name, code: t.code });
        });
        this.TalukIdOptions = talukSelection;
        break;
        
    }
  }
  onSubmit() {
    const params = {
      'Slno': this.Slno,
      'HostelName': this.Hostelname,
      'HostelNameTamil': this.Hosteltamilname,
      'HTypeId': this.Hosteltype.value,
      'Districtcode': this.Districtcode.value,
      'Talukid': this.TalukId.value,
      'BuildingNo': this.Buildingno,
      'Street': this.Street,
      'Landmark': this.Landmark,
      'Pincode': this.pincode,
      'Longitude': this.Longitude,
      'Latitude': this.Latitude,
      'Radius': this.Radius,
      'TotalStudent': this.Totalstudent,
      'Phone': this.mobileNo,
      'HostelImage': 12
    };
    this.restApiService.post(PathConstants.Hostel_Post, params).subscribe(res => {
      if (res !== undefined && res !== null) {
        if (res) {
          //   this.blockUI.stop();
          //   this.clear();
          //   this.messageService.clear();
          //   this.messageService.add({
          //     key: 't-msg', severity: ResponseMessage.SEVERITY_SUCCESS,
          //     summary: ResponseMessage.SUMMARY_SUCCESS, detail: ResponseMessage.SuccessMessage
          //   });
          // } else {
          //   this.blockUI.stop();
          //   this.messageService.clear();
          //   this.messageService.add({
          //     key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
          //     summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.ErrorMessage
          //   });
          // }
          // } else {
          // this.messageService.clear();
          // this.messageService.add({
          //   key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
          //   summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.ErrorMessage
          // });
          // }
          // }, (err: HttpErrorResponse) => {
          // this.blockUI.stop();
          // if (err.status === 0 || err.status === 400) {
          //   this.messageService.clear();
          //   this.messageService.add({
          //     key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
          //     summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.ErrorMessage
          //   })
        }
      }
    })
  }
  onView() {
    const params = {
      'HTypeId': 1,
      'Talukid': 1
    }
    this.restApiService.getByParameters(PathConstants.Hostel_Get, params).subscribe(res => {
      if (res !== null && res !== undefined && res.length !== 0) {
        console.log(res);
        this.data = res;
      }

    })
  }
  camera() {
    
       this.openCamera = true;

  }
  capture() {
   this.captureImage();
  }
  captureImage() {
    console.log('Entered');   
    this.trigger.next(); 
  }
  clear() {

  }


}
