import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { MasterService } from 'src/app/services/master-data.service';
import { RestAPIService } from 'src/app/services/restAPI.service';

@Component({
  selector: 'app-usermaster',
  templateUrl: './usermaster.component.html',
  styleUrls: ['./usermaster.component.css']
})
export class UsermasterComponent implements OnInit {

  UserMaster:any
  emailid: any
  password: any
  selectrole: any
  selectdistrict: any
  selecttaluk: any
  roleOptions: SelectItem[];
  districtOptions: SelectItem[];
  talukOptions: SelectItem[];
  hostelName: any;
  hostelOptions: SelectItem[];

// master
  roles?: any;
  districts?: any;
  taluks?: any;
  hostels?: any;


  constructor(private masterService: MasterService, private restApiService: RestAPIService) { }

  ngOnInit(): void {

    this.districts = this.masterService.getMaster('DT');
    this.taluks = this.masterService.getMaster('TK');
    this.roles = this.masterService.getMaster('RM');

  }

    onSelect(type) {
      let districtSelection = [];
      let talukSelection = [];
      let hostelSelection = [];
      let roleSelection = [];
      switch (type) {
        case 'R':
          this.roles.forEach(r => {
            roleSelection.push({ label: r.name, value: r.code });
          })
          this.roleOptions = roleSelection;
          this.roleOptions.unshift({ label: '-select', value: null });
          break;
        case 'D':
          this.districts.forEach(d => {
            districtSelection.push({ label: d.name, value: d.code });
          })
          this.districtOptions = districtSelection;
          this.districtOptions.unshift({ label: '-select', value: null });
          break;
          case 'T':
            this.taluks.forEach(t => {
              talukSelection.push({ label: t.name, value: t.code });
            })
            this.talukOptions = talukSelection;
            this.talukOptions.unshift({ label: '-select', value: null });
            break;
            case 'HN':
              this.hostels.forEach(h => {
                hostelSelection.push({ label: h.name, value: h.code });
              })
              this.hostelOptions = hostelSelection;
              this.hostelOptions.unshift({ label: '-select', value: null });
              break;
  }
}
selectDistrict() {

  const params = {
    'Type': 1,
    'Value': this.selectdistrict

  }
  if(this.selectdistrict !== null && this.selectdistrict !== undefined){
    this.restApiService.getByParameters(PathConstants.Hostel_Get,params).subscribe(res => {
      if (res !== null && res !== undefined && res.length !== 0){
        this.hostels = res;
      };
    
    })
  }
}
  
  onSubmit(){

  }
  onview(){

  }
  
  onClear(){
    
  }
}
