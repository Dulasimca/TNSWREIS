import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-id-card-info',
  templateUrl: './id-card-info.component.html',
  styleUrls: ['./id-card-info.component.css']
})
export class IdCardInfoComponent implements OnInit {
  name: any;
  class: any;
  section: any;
  dob: any;
  userImage: any;
  bloodGroup: any;
  fatherContact: number;
  motherContact: number;
  guardian: any;
  address: any;

  constructor() { }

  ngOnInit(): void {
  }

}
