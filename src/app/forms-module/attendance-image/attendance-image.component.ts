import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { LocationService } from 'src/app/services/location.service';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import { RestAPIService } from 'src/app/services/restAPI.service';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { User } from 'src/app/Interfaces/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-attendance-image',
  templateUrl: './attendance-image.component.html',
  styleUrls: ['./attendance-image.component.css']
})
export class AttendanceImageComponent implements OnInit {
  date: Date;
  districtname: any;
  talukname: string;
  hostelname: string;
  remarks: any;
  openCamera: boolean;
  location: any;
  login_user: User;
  public errors: WebcamInitError[] = [];
  private trigger: Subject<void> = new Subject<void>();
  constructor(private _locationService: LocationService,private restApiService: RestAPIService,private _authService: AuthService) { }

  ngOnInit(): void {
    this.login_user = this._authService.UserInfo;
    this._locationService.getLocation();
  }
  public webcamImage: WebcamImage = null;
  onSubmit() {

  }
  onView() {

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
}
