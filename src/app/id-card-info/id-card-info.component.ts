import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { PathConstants } from '../Common-Modules/PathConstants';
import { RestAPIService } from '../services/restAPI.service';

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
  district: any;
  taluk: any;
  hostelName: any;
  studentName: any;
  districts?: any;
  taluks?: any;
  hostels?: any;
  students?: any;
  studentOptions: SelectItem[];
  districtOptions: SelectItem[];
  talukOptions: SelectItem[];
  hostelOptions: SelectItem[];
  Show: boolean;

  constructor(private restApiService: RestAPIService) { }

  ngOnInit(): void {
  }
  onSelect(type) {
    let districtSelection = [];
    let talukSelection = [];
    switch (type) {
      case 'D':
        this.districts.forEach(d => {
          districtSelection.push({ label: d.name, value: d.code });
        })
        this.districtOptions = districtSelection;
        this.districtOptions.unshift({ label: '-select', value: null });
        break;
      case 'T':
        this.Show = true;
        this.taluks.forEach(t => {
          if (t.dcode === this.district) {
            talukSelection.push({ label: t.name, value: t.code });
          }
        })
        this.talukOptions = talukSelection;
        this.talukOptions.unshift({ label: '-select', value: null });
        break;
    }
  }
    // hstl based on district 
    selectDistrict() {
      let hostelSelection = [];
      const params = {
        'Type': 1,
        'Value': this.district
  
      }
      if (this.district !== null && this.district !== undefined) {
        this.restApiService.getByParameters(PathConstants.Hostel_Get, params).subscribe(res => {
          if (res !== null && res !== undefined && res.length !== 0) {
            this.hostels = res.Table;
            this.hostels.forEach(h => {
              hostelSelection.push({ label: h.HostelName, value: h.Slno });
            })
            this.hostelOptions = hostelSelection;
            this.hostelOptions.unshift({ label: '-select', value: null });
          };
  
        })
      }
    }
}
