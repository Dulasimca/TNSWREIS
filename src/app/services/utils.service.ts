import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  findMinDate(date: Date): Date {
    if(date !== null && date !== undefined) {
      let _dobYear = date.getFullYear();
      _dobYear += 15;
      const formDate = '01-' + (date.getMonth() + 1) + '-' + _dobYear;
      return new Date(formDate);
    }
  }
}
