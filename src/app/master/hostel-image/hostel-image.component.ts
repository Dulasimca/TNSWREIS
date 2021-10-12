import { Component, OnInit } from '@angular/core';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import { LocationService } from 'src/app/location.service';

@Component({
  selector: 'app-hostel-image',
  templateUrl: './hostel-image.component.html',
  styleUrls: ['./hostel-image.component.css']
})
export class HostelImageComponent implements OnInit {

  openCamera: boolean;
  public errors: WebcamInitError[] = [];
  private trigger: Subject<void> = new Subject<void>();

  constructor(private _locationService: LocationService) { }

  public ngOnInit(): void {
  }
  public webcamImage: WebcamImage = null;

  handleImage(webcamImage: WebcamImage) {
    this.webcamImage = webcamImage;
    this.getLocation();
    this.openCamera = false;
    // console.log('handle', this.webcamImage);
  }
  public triggerSnapshot(): void {
    this.trigger.next();
  }

  public get triggerObservable(): Observable<void> {
    // console.log('trigger', this.trigger);  
     
    return this.trigger.asObservable();
  }

  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }

  camera() {
    this.openCamera = true;
  }

  capture() {
    this.captureImage();
  }

  captureImage() {
    this.trigger.next();
  }

  getLocation() {
    this._locationService.getLocation();
    
  }
}
