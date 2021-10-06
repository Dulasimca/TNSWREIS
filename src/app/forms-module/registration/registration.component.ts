import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { MasterService } from 'src/app/services/master-data.service';

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
  genders?: any;
  age: number;
  bloodGroup: string;
  bloodGroupOptions: SelectItem[];
  bloodgroups?: any;
  motherTongueOptions: SelectItem[];
  motherTongue: string;
  languages?: any;
  religion: string;
  religionOptions: SelectItem[];
  religions?: any;
  caste: string;
  casteOptions: SelectItem[];
  castes?: any;
  schoolOptions: SelectItem[];
  school: string;
  schools?: any;
  courseOptions: SelectItem[];
  course: string;
  courses?: any;

  constructor(private _masterService: MasterService) { }

  ngOnInit(): void {
    const current_year = new Date().getFullYear();
    const start_year_range = current_year - 30;
    this.yearRange = start_year_range + ':' + current_year;
    this.bloodgroups = this._masterService.getMaster('B');
    this.genders = this._masterService.getMaster('G');
    console.log('master', this.genders, this.bloodgroups);
  }

  onSelect(type) {
    switch (type) {
      case 'G':
        this.genderOptions = this.genders;
        break;
      case 'B':
        this.bloodGroupOptions = this.bloodgroups;
        break;
      case 'MT':
        this.motherTongueOptions = this.languages;
        break;
    }
  }

  calculateAge() {
    let timeDiff = Math.abs(Date.now() - this.dob.getTime());
    let age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);
    console.log(age);
    this.age = age;
  }

}
