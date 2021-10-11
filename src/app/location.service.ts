import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  public lat;
  public lng;

  constructor() { }

  getLocation(): Observable<any> {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position: GeolocationPosition) => {
        if (position) {
          console.log("Latitude: " + position.coords.latitude +
            "Longitude: " + position.coords.longitude);
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;
          console.log(this.lat);
          console.log(this.lat);
          return of(this.lat, this.lng);
        }
      },
        (error: GeolocationPositionError) => 
        {
          console.log(error)
          return of(error);
        });
    } else {
      return of('Please try again!')
    }
  return of(this.lng, this.lat);

  }
  
}
