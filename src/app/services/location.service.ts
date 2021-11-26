import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
 

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  public lat;
  public lng;

  constructor() {
    this.getLocation();
   }

  getLocation(): [string, string] {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position: GeolocationPosition) => {
        if (position) {
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;
          return [this.lat, this.lng];
        } 
      },
        (error: GeolocationPositionError) => 
        {
          return (error);
        });
    } else {
      return ['Please try again', '']
    }
  return [this.lat, this.lng];

  }
  
}
