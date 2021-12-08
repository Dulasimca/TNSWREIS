import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'app-ho-fundmanagement',
  templateUrl: './ho-fundmanagement.component.html',
  styleUrls: ['./ho-fundmanagement.component.css']
})
export class HOFundmanagementComponent implements OnInit {

  goNumber: any;
  yearOptions: SelectItem [] ;
  Date: any;
  budjetAmount: any;
  year: any;

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
