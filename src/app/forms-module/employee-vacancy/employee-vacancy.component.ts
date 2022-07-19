import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { SelectItem } from 'primeng/api';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { MasterService } from 'src/app/services/master-data.service';
import { RestAPIService } from 'src/app/services/restAPI.service';

@Component({
  selector: 'app-employee-vacancy',
  templateUrl: './employee-vacancy.component.html',
  styleUrls: ['./employee-vacancy.component.css']
})
export class EmployeeVacancyComponent implements OnInit {
  districtOptions: SelectItem[];
  district: number;
  talukOptions: SelectItem[];
  taluk: number;
  hostelOptions: SelectItem[];
  hostel: number;
  districts?: any = [];
  taluks?: any = [];
  @BlockUI() blockUI: NgBlockUI;
  @ViewChild('f', { static: false }) _employeeVacancyForm: NgForm;
  constructor(private _masterService: MasterService, private _restApiService: RestAPIService) { }

  ngOnInit(): void {
    this.districts = this._masterService.getDistrictAll();
    this.taluks = this._masterService.getTalukAll();
  }

  onSelect(value) {
    let districtSelection = [];
    let talukSelection = [];
    let hostelSelection = [];
    switch (value) {
      case 'DT':
        this.districts.forEach(d => {
          districtSelection.push({ label: d.name, value: d.code });
        })
        this.districtOptions = districtSelection.slice(0);
        this.districtOptions.unshift({ label: '-select-', value: null });
        break;
      case 'TK':
        if (this.district !== undefined && this.district !== null) {
          this.taluks.forEach(t => {
            if (t.dcode === this.district) {
              talukSelection.push({ label: t.name, value: t.code });
            }
          })
          this.talukOptions = talukSelection.slice(0);
          this.talukOptions.unshift({ label: '-select-', value: null });
        }
        break;
    }
  }

  refreshFields(value) {
    if (value === 'D') {
      this._employeeVacancyForm.form.controls['_taluk'].reset();
      this._employeeVacancyForm.form.controls['_hostel'].reset();
      this.taluk = null;
      this.talukOptions = [];
      this.hostel = null;
      this.hostelOptions = [];
      this.loadTasildhar();
    } else {
      this._employeeVacancyForm.form.controls['_hostel'].reset();
      this.hostel = null;
      this.hostelOptions = [];
      this.loadHostelList();
    }
  }


  loadHostelList() {
    this.hostel = null;
    this.hostelOptions = [];
    let hostelSelection = [];
    if (this.district !== null && this.district !== undefined && this.taluk !== undefined && this.taluk !== null) {
      const params = {
        'DCode': this.district,
        'TCode': this.taluk,
      }
      if (this.district !== null && this.district !== undefined &&
        this.taluk !== null && this.taluk !== undefined) {
        this._restApiService.getByParameters(PathConstants.Hostel_Get, params).subscribe(res => {
          if (res !== null && res !== undefined && res.length !== 0) {
            res.Table.forEach(h => {
              hostelSelection.push({ label: h.HostelName, value: h.Slno, gender: h.HGenderType, type: h.HostelFunctioningType });
            })
          }
        })
      }
      this.hostelOptions = hostelSelection;
      this.hostelOptions.unshift({ label: '-select-', value: null });
    }
  }

  loadTasildhar() {
    if(this.district !== null && this.district !== undefined) {
    this._restApiService.getByParameters(PathConstants.TashildarMapping_Get, {})
    }
  }


}
