import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'app-usermaster',
  templateUrl: './usermaster.component.html',
  styleUrls: ['./usermaster.component.css']
})
export class UsermasterComponent implements OnInit {

  UserMaster:any
  emailid:any
  password:any
  selectrole:any
  selectdistrict:any
  selecttaluk:any
  roleOption:SelectItem[];
  districtOption:SelectItem[];
  talukOption:SelectItem[];

  


  constructor() { }

  ngOnInit(): void {
  }
  
  onSubmit(){

  }
  onview(){

  }
  onSelect() {

  }
  onClear(){
    
  }
}
