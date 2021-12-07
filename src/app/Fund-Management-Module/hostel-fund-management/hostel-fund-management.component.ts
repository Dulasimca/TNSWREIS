import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'app-hostel-fund-management',
  templateUrl: './hostel-fund-management.component.html',
  styleUrls: ['./hostel-fund-management.component.css']
})
export class HostelFundManagementComponent implements OnInit {

  yearOptions : SelectItem[];
  year: any;
  districtOptions: SelectItem[];
  district : any;
  taluk: any;
  talukOptions: SelectItem[];
  Damount: any;
  Hamount: any;
  constructor() { }

  ngOnInit(): void {
  }
onSelect(type) {

}
onSubmit(){

}
onView(){
  
}
}

