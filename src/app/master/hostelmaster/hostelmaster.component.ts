import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import { SelectItem } from 'primeng/api';
import {WebcamImage, WebcamInitError, WebcamUtil} from 'ngx-webcam';
import {Subject} from 'rxjs';
import {Observable} from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { RestAPIService } from 'src/app/services/restAPI.service';
import { MasterService } from 'src/app/services/master-data.service';



@Component({
  selector: 'app-hostelmaster',
  templateUrl: './hostelmaster.component.html',
  styleUrls: ['./hostelmaster.component.css']
})
export class HostelmasterComponent implements OnInit {
  @Output()
  public pictureTaken = new EventEmitter<WebcamImage>();
  Hostelname: string;
  Hosteltype: string;
  HosteltypeOptions: SelectItem[];
  DistrictcodeOptions: SelectItem[];
  Districtcode: any;
  TalukId: any;
  TalukIdOptions:SelectItem[];
  Buildingno: any;
  Street: any;
  Landmark: string;
  pincode: any;
  Longitude: any;
  Latitude: any;
  Radius: any;
  Totalstudent: any;
  mobileNo: any;
  data:any;
  hostel?: any;
  daysOptions: SelectItem[];
  // toggle webcam on/off
  public showWebcam = true;
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public deviceId: string;
  public videoOptions: MediaTrackConstraints = {
    // width: {ideal: 1024},
    // height: {ideal: 576}
  };
  public errors: WebcamInitError[] = [];
   // webcam snapshot trigger
   private trigger: Subject<void> = new Subject<void>();
 // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
 private nextWebcam: Subject<boolean|string> = new Subject<boolean|string>();

  


  constructor( private http: HttpClient, private restApiService: RestAPIService, 
    private masterService: MasterService
   ) { }

  ngOnInit(): void {
    
    WebcamUtil.getAvailableVideoInputs()
    .then((mediaDevices: MediaDeviceInfo[]) => {
      this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
    });
    this.hostel = this.masterService.getMaster('Hostel');
   
  }
  public handleImage(webcamImage: WebcamImage): void {
    console.info('received webcam image', webcamImage);
    this.pictureTaken.emit(webcamImage);
  }
  public cameraWasSwitched(deviceId: string): void {
    console.log('active device: ' + deviceId);
    this.deviceId = deviceId;
  }
  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }
  public get nextWebcamObservable(): Observable<boolean|string> {
    return this.nextWebcam.asObservable();
  }
  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }
  public triggerSnapshot(): void {
    this.trigger.next();
  }
  public showNextWebcam(directionOrDeviceId: boolean|string): void {
    // true => move forward through devices
    // false => move backwards through devices
    // string => move to device with given deviceId
    this.nextWebcam.next(directionOrDeviceId);
  }
  onSelect() {
    let HosteltypeOptions = [];
    
    this.hostel.forEach(c => {
      HosteltypeOptions.push({  label : c.name, value: c.code })
    });
    this.daysOptions = HosteltypeOptions;
    this.daysOptions.unshift({ label: '-select', value: null });
  }
  onSubmit(){

  }
  onView() {
    const params = { 
     
    }
   this.restApiService.getByParameters(PathConstants.MasterData_Get, params).subscribe(res => {
    if(res !== null && res !== undefined && res.length !==0) {
      console.log(res);
      this.data = res;
    }
    
  })
  }
  clear() {

  }
 

}
