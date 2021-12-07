import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'app-do-fund-management',
  templateUrl: './do-fund-management.component.html',
  styleUrls: ['./do-fund-management.component.css']
})
export class DOFundManagementComponent implements OnInit {
  yearOptions : SelectItem [];
  year: any;
  budjetAmount: Number;
  districtOptions: SelectItem [];
  amount: number;
  district:any;


  constructor() { }

  ngOnInit(): void {
    
  }
  onSelect(type) {

  }
onSave() {

}
onView() {

}
}
