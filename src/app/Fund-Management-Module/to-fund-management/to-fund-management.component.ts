import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'app-to-fund-management',
  templateUrl: './to-fund-management.component.html',
  styleUrls: ['./to-fund-management.component.css']
})
export class TOFundManagementComponent implements OnInit {
  amount: any;
  Damount: any;
  year: any;
  district: any;
  districtOptions: SelectItem[];
  yearOptions:  SelectItem[];

  constructor() { }

  ngOnInit(): void {
  }
  onSelect(type){

  }
  onSave(){

  }
  onView(){
    
  }
}
