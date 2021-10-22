import { Component, OnInit } from '@angular/core';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import { LocationService } from 'src/app/services/location.service';
import { RestAPIService } from 'src/app/services/restAPI.service';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/Interfaces/user';

@Component({
  selector: 'app-hostel-image',
  templateUrl: './hostel-image.component.html',
  styleUrls: ['./hostel-image.component.css']
})
export class HostelImageComponent implements OnInit {
  location: any;
  openCamera: boolean;
  login_user: User;
  hostelname: string;
  districtname: string;
  talukname: string;
  public errors: WebcamInitError[] = [];
  private trigger: Subject<void> = new Subject<void>();

  constructor(private _locationService: LocationService,private restApiService: RestAPIService,private _authService: AuthService) { }

  ngOnInit(): void {
    this.login_user = this._authService.UserInfo;
     this._locationService.getLocation();
  }
  public webcamImage: WebcamImage = null;

  handleImage(webcamImage: WebcamImage) {
    console.log('handle');
    this.webcamImage = webcamImage;
    console.log(this.webcamImage);
      var byteString = atob(this.webcamImage.imageAsDataUrl.split(',')[1]);
      var ab = new ArrayBuffer(byteString.length);
      var ia = new Uint8Array(ab);
      for (var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
      }
    this.openCamera = false;
    const params = {
      'HostelId':this.login_user.hostelId,
      'HostelImage': this.webcamImage,
      'Longitude':this.location[1],
      'Latitude':this.location[0]
    }

     this.restApiService.put(PathConstants.Hostel_put,params).subscribe(res => {
       if (res) {
 
   }
});
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

}
