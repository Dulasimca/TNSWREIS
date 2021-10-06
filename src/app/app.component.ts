import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import {WebcamImage} from 'ngx-webcam';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'TNMenu';
  hideHeader: boolean = false;

  constructor(private _router: Router) {
    this._router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (event.url === '/login') {
          this.hideHeader = true;
        } else {
          this.hideHeader = false;
        }
      }
    });
  }
  public webcamImage: WebcamImage = null;

  handleImage(webcamImage: WebcamImage) {
    this.webcamImage = webcamImage;
  }
}
