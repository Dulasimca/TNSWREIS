import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  studentName: string;
  dob: Date;
  yearRange: string;
  genderOptions: SelectItem[];
  gender: any;

  constructor() { }

  ngOnInit(): void {
    const current_year = new Date().getFullYear();
    const start_year_range = current_year - 30;
    this.yearRange = start_year_range + ':' + current_year;
  }

  onSelect(type) {
    
  }

}
