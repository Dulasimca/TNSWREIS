import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import { SelectItem } from 'primeng/api';
import {WebcamImage, WebcamInitError, WebcamUtil} from 'ngx-webcam';
import {Subject} from 'rxjs';
import {Observable} from 'rxjs';



@Component({
  selector: 'app-hostelmaster',
  templateUrl: './hostelmaster.component.html',
  styleUrls: ['./hostelmaster.component.css']
})
export class HostelmasterComponent implements OnInit {
  @Output()
  Hostelname: string;
  HTypeId: any;
  HTypeIdOptions: SelectItem[];
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
  public showWebcam = true;
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public pictureTaken = new EventEmitter<WebcamImage>();
  public deviceId: string;
  public errors: WebcamInitError[] = [];
  private trigger: Subject<void> = new Subject<void>();
  public videoOptions: MediaTrackConstraints = {
    // width: {ideal: 1024},
    // height: {ideal: 576}
  };
  private nextWebcam: Subject<boolean|string> = new Subject<boolean|string>();
  


  constructor() { }

  ngOnInit(): void {
    WebcamUtil.getAvailableVideoInputs()
    .then((mediaDevices: MediaDeviceInfo[]) => {
      this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
    });
    this.HTypeIdOptions =[
      { label: '-select-', value: null },
      { label: '1', value: 'Home Work'},
      { label: '2', value: 'Class Work'},
    ];
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
  onSubmit(){

  }
  onView() {

  }
  clear() {

  }
 

}
